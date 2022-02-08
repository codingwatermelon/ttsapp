#!/bin/bash

GetSleepTime() {
	# Full path to file is in $1
	output=$(ffprobe $1 2>&1 | grep "Duration")
	split=(${output//,/ })
	duration=${split[1]}

	durationSplit=(${duration//:/ })

	seconds=$((durationSplit[0]*3600))

	seconds=$((seconds + (durationSplit[1]*60)))

	secondsField=(${durationSplit[2]//./ })

	seconds=$((seconds + (secondsField[0])))

	echo $seconds
}

# where $1 ($PLAYING/$MEDIAFILE) is the file to play, $2 ($PROCESSED/$MEDIAFILE) is the folder to move the file to after finished playing
ProcessAndPlayFile() {

	omxplayer -o local $1 &

	secondsToSleep=$(GetSleepTime "$1")

	echo Sleeping for $secondsToSleep seconds

	sleep $secondsToSleep

	echo Moving $1 to PROCESSED folder

	mv "$1" "$2"

	sleep 2

}

TARGET=/home/pi/discordbot/discordbotmedia/
PLAYING=/home/pi/discordbot/discordbotmedia/playing
PROCESSED=/home/pi/discordbot/discordbotmedia/processed
TXTFILES=/home/pi/discordbot/discordbotmedia/txtfiles

SCRIPTDIR=/etc/discordbot

inotifywait -m -e create -e moved_to --format "%f" $TARGET \
	        | while read FILENAME
                do
			# Check if PROCESSED directory is getting too full (> 10 GB)
			processedDirSize=$(du -s /home/pi/discordbot/discordbotmedia/processed)
			splitVar=(${processedDirSize// /})
			processedDirSizeBytes=${splitVar[0]}

			if [ $processedDirSizeBytes -gt 10000000000 ];then

				rm -rf /home/pi/discordbot/discordbotmedia/processed/*.mp3

			fi

			MEDIAFILE=$FILENAME

			# Check for tts text files
			if [ "$(find $TARGET -maxdepth 1 -type f -name "*.txt")" ]; then

				echo Detected $FILENAME as TTS file, creating .mp3 file via Python script

				mv "$TARGET/$FILENAME" "$TXTFILES/$FILENAME"

				splitVar=(${FILENAME//./})
				MEDIAFILE="${splitVar[0]}.wav"

				echo Path to file "$TXTFILES/$FILENAME"

				echo Mediafile "$MEDIAFILE"

				espeak -f "$TXTFILES/$FILENAME" -w "$TARGET/$MEDIAFILE"

				# Process and play file?

				#python3 "$SCRIPTDIR/textToSpeechFile.py" "$(cat "$TXTFILES/$FILENAME")" "$MEDIAFILE"


				#ProcessAndPlayFile "$PLAYING/$MEDIAFILE" "$PROCESSED"
				
				sleep 2
			fi

			# Check if song is playing already
			if [ ! "$(ls -A $PLAYING)" ]; then

				echo Detected $MEDIAFILE, moving and playing file

				echo MEDIAFILE "$TARGET/$MEDIAFILE", PLAYING "$PLAYING/$MEDIAFILE"
                	        mv "$TARGET/$MEDIAFILE" "$PLAYING/$MEDIAFILE"

				sleep 3

				ProcessAndPlayFile "$PLAYING/$MEDIAFILE" "$PROCESSED/$MEDIAFILE"

				CONTINUE=true

				while [ "$CONTINUE" = true ]
				do
					QUEUEDSONGS=$(find $TARGET -maxdepth 1 -type f -name "*.mp3" | sort -n)

					if [ "$QUEUEDSONGS" ]; then

						# Find first song in queue based on filename
						for i in ${QUEUEDSONGS[@]}; do

							ProcessAndPlayFile "$i" "$PROCESSED"
							#omxplayer "$i" &

							#secondsToSleep=$(GetSleepTime "$i")

							#echo Sleeping for $secondsToSleep seconds

							#sleep $secondsToSleep

							#echo Moving $i to PROCESSED folder
							#mv "$i" "$PROCESSED"

							#sleep 2

						done

					else
						echo Cleared queue.

						CONTINUE=false
					fi

					QUEUEDTTS=$(find $TARGET -maxdepth 1 -type f -name "*.txt")

					if [ "$QUEUEDTTS" ]; then

						for i in ${QUEUEDTTS[@]}; do

							echo Detected $i as TTS file, creating .wav file

							# Create .mp3 filename from full path to .txt file
							split=(${i//// })
							split2=(${split[-1]//./ })
							MEDIAFILE="${split2[0]}.wav"

							espeak -f "$i" -w "$PLAYING/$MEDIAFILE"
							#python3 "$SCRIPTDIR/textToSpeechFile.py" "$(cat "$i")" "$MEDIAFILE"

							mv "$i" "$TXTFILES"

							ProcessAndPlayFile "$PLAYING/$MEDIAFILE" "$PROCESSED"
						done
					fi

				done
			fi

		done
