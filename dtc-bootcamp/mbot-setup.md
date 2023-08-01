---
layout: default
title: MBot Setup - Robotics 102
dtc: true
---

# Tutorial: MBot System Setup
{: .no_toc }

This guide will walk you through setting up all the code and automated services that allow the robot to run. This guide should be followed once before students begin their course projects. All project instructions assume that the robots have been setup following the steps outlined here.

The Robotics 102 philosophy is that students should be able to get up and running with the robots with as few obstacles as possible. At UM, instructional aides setup the robots for the students. Each offering of the course should choose which installation steps, if any, will be the responsibility of the students. It is beneficial to create an image with the desired setup to save time.

### Contents
{: .no_toc }

* TOC
{:toc}

---

## Prerequisites
{: .line}

For this setup, you will need:
* A 16 or 32 GB SD card
* A monitor and a mini-HDMI to HDMI cable
* A keyboard and mouse
* An assembled MBot
* A fully charged robot battery
* A laptop connected to the internet

Before you begin, install the following on your laptop:
* [VSCode](/tutorials/setup.html)
* NoMachine (download from [NoMachine website](https://www.nomachine.com/))

The robot username and password are:

&emsp;&emsp;**Username:** `mbot` <br/>
&emsp;&emsp;**Password:** `i<3robots!`

---

## Step 1: Flashing the Image
{: .line}

In this step, we will get a Raspberry Pi OS image on the robot.

1. **Download [Balena Etcher](https://etcher.balena.io/) to your laptop.**
2. **Download the [base Raspberry Pi OS image](https://drive.google.com/drive/folders/1oP-9gXUPYl2bXEoIO8-tfV6_PLIMskaB?usp=drive_link) for the MBot to your computer.** This is the standard 64-bit RPi OS image, but we have added a couple configurations (username, password, config changes, and a WiFi script).
3. **Flash the image to a blank SD card using Balena Etcher.**

## Step 2: Configuring the robot
{: .line}

At this stage, the Raspberry Pi is not connected to WiFi so we will need to configure it using a monitor, keyboard, and mouse.

1. **Prepare the MBot.**
    1. Insert the SD card into the Raspberri Pi on your robot.
    2. Plug in a fully charged battery into the MBot. The barrel plug must be plugged into the Robotics Control Board (on the bottom plate), and the USB port must be plugged into the Raspberry Pi (on the middle plate).
    3. Connect the robot to a monitor using the mini-HDMI port located on the side of the Raspberry Pi. Connect your keyboard and mouse to the USB ports on the Raspberry Pi.
    4. Turn on the robot by toggling the battery switch.

2. **Connect to WiFi.** At the University of Michigan, this can be accomplished running the setup script in the terminal:
        ```bash
        ./Desktop/SecureW2_JoinNow.run
        ```
    Enter your credentials when prompted. If on a personal network, connect using the network dropdown menu.

3. **Get the system utilities repo on the robot.** We will clone a repo onto the robot which has a number of scripts to install necessary dependencies.
    1. Get the robot's IP address. You will need to use the monitor and keyboard. Open a terminal then type `ifconfig wlan0` to get the IP:
        <span class="image centered"><img src="/assets/images/dtc/robot-ifconfig.png" alt="" style="max-width:500px;"/></span>
    2. Connect to the robot in a VSCode Remote session from your laptop. Instructions are [here](/tutorials/robot.html#sec_robot_prog).
    3. Clone the repo `mbot_sys_utils` onto the robot. Open a terminal in the VSCode remote session, then do:
        ```bash
        git clone https://github.com/MBot-Project-Development/mbot_sys_utils.git
        ```
        If this is the first time you have cloned a repo with HTTPS in VSCode on your laptop, it will prompt you to give VSCode permission to connect to GitHub and ask you to login on your browser. Follow the prompts to grant this permission. Your credentials will be stored in your laptop's credential manager. You will not need to enter your GitHub credentials again.

        *You must clone this repo in a VSCode terminal!* The automated GitHub login will not work in a regular terminal (i.e. using the monitor and keyboard).

4. **Install dependencies and services.**
    1. Install the dependencies, including LCM and NoMachine.
        ```bash
        cd mbot_sys_utils/
        sudo ./install_scripts/install_mbot_dependencies.sh
        ./install_scripts/install_lcm.sh
        sudo ./install_scripts/install_nomachine.sh
        ```
        NoMachine is not needed for the MBot code to run, but it is very helpful for debugging later, and is required for these instructions.
    2. Setup the MBot configuration. First, copy the default config from `mbot_sys_utils`:
        ```bash
        sudo cp mbot_config.txt /boot/
        ```
        Then, edit the config:
        ```bash
        sudo nano /boot/mbot_config.txt
        ```
        Give the robot a *unique hostname* under `mbot_hostname`. The hostname should match the hostname written on the MBot.

        You can also setup a home WiFi connection in this file, and update the IP registry repo. The defaults will work.
    3. Install the udev rules for the Lidar and Robotics Control Board:
        ```bash
        cd ~/mbot_sys_utils/udev_rules
        ./install_rules.sh
        ```
    4. Install the services needed to start the networking and report the robot's IP:
        ```bash
        cd ~/mbot_sys_utils/services
        ./install_mbot_services.sh
        ```

    Now, test that everything worked. Restart the robot with `sudo reboot`. You will need to reload the VSCode remote window. The robot should now publish its IP address to the [MBot IP registry](https://github.com/MBot-Project-Development/mbot_ip_registry) (as configured in `mbot_config.txt`).

    The first time the robot is restarted, it might publish with the username `raspberrypi`. This should be resolved by rebooting the robot again.

At this point, the robot should publish its IP to the registry each time it turns on. The IP might change occasionally. You can now use VSCode, SSH, or NoMachine to interface with the MBot by using the IP it reports to the registry. You should not need the monitor or keyboard and mouse anymore.

## Step 3: Calibrating and Flashing the MBot
{: .line}

1. **Get the Pico firmware.**
    1. Connect to the MBot in NoMachine. You will need the robot's IP, which you can get from the [MBot IP registry](https://github.com/MBot-Project-Development/mbot_ip_registry).
    2. Download the MBot firmware from [here](https://drive.google.com/drive/folders/11_80nXbH66nH3hYHewc8GNmNH3505_qj?usp=drive_link). You will need the `mbot_calibrate_omni.uf2` and `mbot.uf2` files. Downloading the tests is optional.
    3. Drag and drop the two files from your laptop to the robot's desktop using NoMachine.

2. **Calibrate the MBot.** We will now flash the calibration script onto the Pico to calibrate it before we flash it.

    The calibration script detects the motor and encoder polarity and then calibrates the motor coefficients. The robot will move around for this step so you will need clear space on the floor (preferably on the same type of surface that you plan to use the robots on).

    *Do not run the calibration script with the MBot on a table!!*

    1. First, unplug the Robotics Control Board by disconnecting the barrel plug from the battery (leave the USB that powers the RPi plugged in). Also unplug the USB that connects the Pico to the Raspberry Pi.
    2. We will now put the Pico in flashing mode. Hold down the white `BOOTSEL` button on the Pico board (it's near the USB port). With the button held down, plug the Pico's USB cord back into the Raspberry Pi. Then release the button. The Pico should now show up as a device in NoMachine (see below).
        <span class="image centered"><img src="/assets/images/dtc/pop-up-plug-in.png" alt="" style="max-width:800px;"/></span>
    3. Plug the barrel plug that powers the Robotics Control Board back into the battery.
    4. Place the MBot on the floor in a spot with at least 2 feet of clear space all around the robot.
    5. Open the Pico device folder in NoMachine. Drag and drop the script `mbot_calibrate_omni.uf2` into the folder. The Pico will reboot automatically, and will then run its calibration routine. *Don't touch the robot while it does this procedure.*

3. **Flash the MBot Firmware onto the Pico.** The calibration script will have saved parameters onto the Pico's memory. We can now flash the firmware that will run on the Pico during operation. We will be repeating the flashing procedure.
    1. Repeat steps 1-3 from the calibration instructions to put the Pico into flashing mode.
    2. Open the Pico device folder in NoMachine. Drag and drop the script `mbot.uf2` into the folder. The Pico will reboot automatically.

## Step 4: Install the MBot Code
{: .line}

This step will pull all the code utilities for the MBot Web App, SLAM, sensor drivers, and communication with the Robotics Control Board.

1. **Clone the necessary repos.** There is a script to help you with this in `mbot_sys_utils`. To use it, do:
    ```bash
    cd mbot_sys_utils
    ./setup_workspace.sh ~/mbot_ws
    ```
    Note: The script will pull in all the code repos. We will not use all of them in this guide.

2. **Install the base MBot code.** This includes the message types and serial server which communicates between the Robotics Control Board and the RPi using LCM. The install script will compile the code and install it onto the robot. It will also install a service to automatically start the serial server on startup.
    ```bash
    cd ~/mbot_ws/mbot_lcm_base/
    ./scripts/install.sh
    ```
3. **Install the MBot Web App.** The web app is a useful tool for commanding the robot from your laptop's browser.
    1. The installation requires you to install a program called NPM first. To do this, do:
        ```bash
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
        source ~/.bashrc  # Reload to apply changes.
        ```
        Install the latest version of NodeJS (as of this writing, the latest version is 18):
        ```bash
        nvm install 18
        ```
        Now you should have the `node` and `npm` command installed. You can check with `node --version` and `npm --version`.
    2. Install the web app dependencies:
        ```bash
        cd ~/mbot_ws/mbot_web_app/
        ./scripts/install_nginx.sh
        ./scripts/install_python_deps.sh
        ```
    3. Build and install the app:
        ```bash
        ./scripts/deploy_app.sh
        ```

The web app should now be available by going to your browser and typing in the robot's IP address.

At this point, if the firmware is flashed and the serial server is running, you should be able to drive the robot through the webapp. Toggle drive mode on then use the keys `AWSDQE` to drive the robot.

4. **Install the RPLidar driver.** To install the Lidar driver, do:
    ```bash
    cd ~/mbot_ws/rplidar_lcm_driver/
    ./scripts/install.sh
    ```
    This will pull some code dependencies, compile and install the code, and install a service to start the driver on startup.

5. **Install the MBot Autonomy code.** The autonomy code includes SLAM and a motion controller program. Install it with:
    ```bash
    cd ~/mbot_ws/mbot_autonomy/
    ./scripts/install.sh
    ```
    Again, this installs the binaries and services needed to run SLAM and the motor controller.

---

## Testing the Setup
{: .line}

We're done! You should test your setup by making sure you can drive the robot around and create a map in the web app.

You should be able to remove all the setup code if desired (`mbot_ws` and `mbot_sys_utils`).
