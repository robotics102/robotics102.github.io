---
layout: default
title: Debugging Tips - Robotics 102
dtc: true
---

# Tutorial: Debugging Tips
{: .no_toc }

This guide contains various tips for debugging common problems with the robot.

### Contents
{: .no_toc }

* TOC
{:toc}

---

## Viewing LCM Channels
{: .line}

If some function of the robot isn't working, it's often helpful to look at the *LCM channels* on the Raspberry Pi. If certain channels are missing, that provides a clue about which program might not be working.

To look at the channels, we can use a program provided by LCM called LCM Spy. We require a GUI to use the tool, so we must be connected to the Raspberry Pi using NoMachine or a monitor.

Open a terminal on the Raspberry Pi from NoMachine and type:
```bash
lcm-spy
```

You should see a window that looks like this:

<span class="image centered"><img src="/assets/images/dtc/debug/lcm-spy.png" alt="" style="max-width:600px;"/></span>

You can also double click on a channel to see the data that's being published.

<span class="image centered"><img src="/assets/images/dtc/debug/lcm-spy-details.png" alt="" style="max-width:600px;"/></span>

<ul class="hint">
    <li class="icon solid fa-cogs"><strong>Hint:</strong> If you don't see the types defined beside each of the channels in LCM Spy, your <code>CLASSPATH</code> variable might not be sent correctly. See the instructions in <a href="https://github.com/MBot-Project-Development/mbot_lcm_base" target="_blank">LCM base</a> repo for how to set it to find the messages.</li>
</ul>

---

## Checking Service Status
{: .line}

Background processes are run on the robot on startup using Linux *services*. If something is not working or not responding on the robot, you check whether the corresponding services are running. You can also check the service logs for any errors or messages of interest. To check the status of a service, do:
```bash
sudo systemctl status [SERVICE-NAME].service
```
where all of `[SERVICE-NAME]` is replaced with the name of the service. All relevant services should be `active`. The might have some information printed out. Make note of any warning or error messages.

You can look at the logs of a service with:
```bash
sudo journalctl -u [SERVICE-NAME].service
```
Add `-b` to the end of the above command to only see the logs generated for the current boot (otherwise, it will show you logs from however many sessions it is storing).

<ul class="hint">
    <li class="icon solid fa-cogs"><strong>Hint:</strong> When seeking debugging help, copy or screenshot the full output of the system status message for the relevant services, including any logged info, and send it to the instructors.</li>
</ul>

### Networking Services

The following services run *once* on startup, to set the networking. They should have exited successfully after running:
*  `mbot-start-network.service`
*  `mbot-publish-info.service`

These services also have additional logs generated which are stored in the directory `/var/log/mbot/`. If you have a problem with the IP publishing script or networking, also look at these logs.

### MBot Services

The following services run the code that the robot needs. The service of interest depends on your problem.

* `mbot-lcm-serial.service`: This runs the server that communicates between the RPi and the Pico. Check this service if the wheels aren't responding to drive commands or if you can't read the odometry.
* `mbot-rplidar-driver.service`: This controls the Lidar driver. Check this service if SLAM isn't working or if you can't read Lidar data.
* `mbot-slam.service`; This runs SLAM. Check this service if SLAM is not responding.
* `mbot-motion-controller.service`: This generates motion commands to follow paths. Check this if you are publishing a path but the robot is not following it correctly.
