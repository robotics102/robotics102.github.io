---
layout: default
title: Debugging Tips - Robotics 102
dtc: true
---

<header class="main project">
    <strong>Tutorial:</strong> Debugging Tips
</header>

This guide contains various tips for debugging common problems with the robot.

#### Contents

* [Viewing LCM Channels](#lcm-spy)

<hr class="major" />

<header class="major" id="lcm-spy">
    <h3><a href="#lcm-spy">Viewing LCM Channels</a></h3>
</header>

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
