# tomodachi-print

NXBT Macro generator for printing in Tomodachi Life: Living the Dream.
This is a Node.js application that transforms JSON files exported from the [Living the Grid](https://living-the-grid.gozapp.dev/) website into an NXBT-compatible macro file.

*Note: In this README **"NXBT"** is usually used to refer to both NXBT and NUXBT as they are mostly interchangeable*

## Prerequisites
* [Node.js](https://nodejs.org/) v20 and up installed on your machine.
* [NXBT](https://github.com/Brikwerk/nxbt) or [NUXBT](https://github.com/hannahbee91/nuxbt) installed (If you don't have one of these already installed I recommend using NUXBT to support newer versions of python).

*Note: Your machine must be running a Linux based OS and have bluetooth capabilities for NXBT to work.*

## Installation
Clone or download the repository:
```bash
git clone https://github.com/JeanSamGirard/tomodachi-print.git
```
This project currently uses no external dependencies running `npm install` is unnecessary.

## Before using

### Verify prerequisites
1. Verify your node version (Should be v20 or higher)
```bash
node --version
```
2. Verify that you can create a controller and connect to your switch using NXBT
>(Refer to the README of the NXBT project you're using for how to test NXBT)

### Prepare the input JSON using Living the Grid

1. Upload the image of your choice to the website
><img width="746" height="620" alt="image" src="https://github.com/user-attachments/assets/9abecda8-1964-4d9f-aebb-89ea18231113" />

2. Make sure to select the smooth 1px brush, this tool currently does not support other brush sizes
><img width="315" height="178" alt="image" src="https://github.com/user-attachments/assets/dff93178-f82d-4156-b382-485f3f49f366" />

3. Adjust any other options you wish until the preview looks like what you want
><img width="1086" height="740" alt="image" src="https://github.com/user-attachments/assets/2902ca4f-1382-43ba-806e-308e7fc732b5" />


4. Download as JSON
><img width="477" height="284" alt="image" src="https://github.com/user-attachments/assets/1c8a0170-c6a8-4845-813e-ba5290f314fe" />



## How to use
TODO
