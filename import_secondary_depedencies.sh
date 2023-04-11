#!/usr/bin/env bash
# This is supossed to import the dependencies of /meme
# Do not run if you don't want this functionality lol

cd cassiohcore/Commands/CommandsAssets/
if [ ! -d "MemeGen" ]; then
    mkdir MemeGen
    cd MemeGen
    git clone https://github.com/gab-simon/Computudos-Simulator.git
else
    cd MemeGen
fi

if which pip &>/dev/null; then
    pip install opencv-python
else
    printf "You don't have pip lol, install it pls"
    exit
fi



