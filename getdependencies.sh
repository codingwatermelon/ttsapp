# Allow your user to sudo (where "pi" is your user)
sudo usermod -aG sudo pi

# Update Raspberry Pi OS and software
sudo apt upgrade
sudo apt update

# Get docker install script and run it
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Allow the docker user to sudo
sudo usermod -aG docker pi

# Install bot media watchdog tools (used in script 'watchmediadir.sh')
sudo apt install inotify-tools

# Install text-to-speech (TTS) processor
sudo apt install espeak
