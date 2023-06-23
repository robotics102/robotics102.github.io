---
layout: default
title: Follow Me Activity - Robotics 102 DTC
---

<header class="main project">
    <!-- <h2>Follow Me Activity</h2> -->
    <strong>Activity:</strong> Follow Me
    <p style="font-size: 0.5em;">DTC Summer Bootcamp (Day 1)</p>
</header>

This is our first activity on the MBot! We will implement a Bang-Bang controller to get the robot to follow the nearest object.

<hr class="major" />

<header class="major" id="prerequisites">
    <h3><a href="#prerequisites">Prerequisites</a></h3>
</header>

Grab a robot with a fully charged battery.
Before you begin, you will need to have followed these guides on your laptop:
* Install VSCode ([tutorial](/tutorials/setup.html))
* Connect to the MBot with VSCode remote ([tutorial](/tutorials/robot.html#sec_robot_prog))

<hr class="major" />

<header class="major" id="get-code">
    <h3><a href="#get-code">Getting the Code</a></h3>
</header>

We will use GitHub Classroom to get the code. Use the link below to accept the assignment.

<ul class="link-box">
    <li class="icon solid fa-link">
        <strong>Accept the Follow Me assignment:</strong>
        <a href="https://docs.google.com/document/d/1ppkNj2ft377G_Su0ave4pDe0A3_GRCkConf4jKNvTcw/edit?usp=sharing" target="_blank">Assignment Link Google Doc</a>
    </li>
</ul>

Once you have accepted the assignment, clone the repository you created on the robot. In a VSCode remote session connected to the robot ([tutorial](/tutorials/robot.html#sec_robot_prog)), open a new terminal. Then, type:
```bash
git clone <ADDRESS>
```
Substitute **&lt;ADDRESS&gt;** with the address for your repo, found on GitHub. Open the folder of the repository you just cloned in VSCode.

<hr class="major" />

<header class="major" id="code">
    <h3><a href="#code">Code Overview</a></h3>
</header>

The code you just cloned has some template files to help you get started. Details on how to compile the code and the code layout are below.

### Compiling the Code

We'll use a tool called **CMake** to compile the code. CMake finds all the code and external libraries we need and generates instructions to build the executable. To build the code, in a terminal, type:

```bash
cd ~/[my-code-dir]/build
cmake ..
make
```

Remember that the code should be cloned and compiled on the Raspberry Pi. This will fail on your computer!
You should replace `[my-code-dir]` with the name of your Follow Me directoy.

*You only need to run `cmake ..` once.* When you start writing code, you can compile it by typing `make` in the `build/` folder. (Calling CMake multiple times won't hurt, though!)

### Running the Code

When you run `make` successfully, it will generate two executables: `follow_1D` is the 1D Follow Me code from the file `src/follow_1D.cpp`, and `follow_2D` is the 2D Follow Me code from the file `src/follow_2D.cpp`.

Run them from the command line, in the `build/` folder, to test your code:
```bash
./follow_1D  # Test the 1D Follow Me
./follow_2D  # Test the 2D Follow Me
```

### Provided Functions

<ul class="hint">
    <li class="icon solid fa-cogs">
        <code>void drive(float vx, float vy, float wz)</code>: Send a velocity command to the motors. The velocity command has x and y components in meters per second (<code>vx</code> and <code>vy</code>) and an angular component in radians per second (<code>wz</code>).<br/>
        <strong>Warning:</strong> Once <code>drive</code> is called, the robot will continue to drive at the given speed until you tell it to stop! Use <code>drive(0, 0, 0)</code> to stop the robot.
    </li>
    <li class="icon solid fa-cogs">
        <code>void getLidarScan(std::vector&lt;float&gt;&amp; ranges, std::vector&lt;float&gt;&amp; thetas)</code>: Read the most recent Lidar scan and put the resulting ranges in the <code>ranges</code> vector, and angles in the <code>thetas</code> vector. <br/>
        <strong>Warning:</strong> Some rays in the scan never return (for example, if there are no obstacles, or the ray bounces off a material and goes in a different direction). If the ray does not return, its range will be zero. Make sure you check for rays with zero range and ignore them.
    </li>
    <li class="icon solid fa-cogs">
        <code>double normalizeAngle(double angle)</code>: Normalize an angle in the range [-pi, pi]. This function returns the normalized angle.
    </li>
</ul>

<hr class="major" />

<header class="major" id="code">
    <h3><a href="#follow-me">Follow Me Activity</a></h3>
</header>

We will write code to make the robot follow the nearest object. We will implement a 1D version which follows the object in front of it, and a 2D version that follows the nearest object in any direction.

### 1D Follow Me

We will write a program to make the robot maintain a fixed distance from the object in front of it. Edit the file `src/follow_1D.cpp` to implement a Bang-Bang controller.

<ul class="todo">
    <li class="icon solid fa-laptop-code">
        Edit the file <code>src/follow_1D.cpp</code> to implement a Bang-Bang controller.
        Commit and push your changes to GitHub.
    </li>
</ul>

### 2D Follow Me

First, you will need to write the function `findMinDist()`. This function should take in a vector of Lidar range values, and return the *index* of the shortest ray in the scan.
