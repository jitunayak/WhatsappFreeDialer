```
github_cli_token = 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

```

## React native cloud setup 

sudo apt-get install npm -y

sudo npm i -g n

sudo n latest

sudo apt-get install openjdk-11-jdk

sudo apt update && sudo apt install android-sdk

sudo npm install -g yarn

git clone https://github.com/jitunayak/WhatsappFreeDialer/

cd project

yarn 

### Setting up android build tools
sudo apt-get install android-sdk


wget https://dl.google.com/android/repository/commandlinetools-linux-7583922_latest.zip


unzip commandlinetools-linux-7583922_latest.zip -d cmd-tools

sudo mv cmdline-tools $ANDROID_HOME/

export PATH=$ANDROID_HOME/cmdline-tools/tools/bin:$PATH

source ~/.bashrc

yes | $ANDROID_HOME/cmdline-tools/cmdline-tools/bin/sdkmanag
er –licenses

Go to Android\sdk\tools\bin
yes | sdkmanager --licenses


sudo $ANDROID_HOME/cmdline-tools/cmdline-tools/bin/sdkmanager "build-tools;30.0.2"


cd android 

touch local.properties and edit it


sdk.dir = /home/USERNAME/Android/Sdk


## Generating APKs

sudo ./gradlew assembleDebug

sudo ./gradlew assembleRelease

usr/lib/android-sdk/cmdline-tools/cmdline-tools/bin


android/app/build/outputs/apk/release/app-release.apk 


mkdir RELEASE_APK

cp android/app/build/outputs/apk/release/app-release.apk RELEASE_APK

mv RELEASE_APK/app-release.apk RELEASE_APK/WhatAppFreeDialer.apk

