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
><br>
>Note that using more than 9 colors increases printing time by a lot due to the limited amount of colors that can be selected at once in the game palette.
>Larger images naturally take longer to print.
>You can save a little bit of time by putting your image at the top left corner since this is where the cursor starting position is for printing.


4. Download as JSON
><img width="477" height="284" alt="image" src="https://github.com/user-attachments/assets/1c8a0170-c6a8-4845-813e-ba5290f314fe" />

## How to use

### Generating the macro

1. Navigate into the project directory
```bash
cd tomodachi-print
```

2. Run the program with your JSON file as input
```bash
npm start YOUR_JSON_FILE_PATH [OPTIONAL_NUMBER_OF_LINES_TO_SKIP] 
```
>It can be useful to skip lines if a previous run bugged or desynchronized and you want to continue an existing partial drawing.

After running this command, a text file containing the macro is created in the same parent folder as your JSON input file.

#### Structure of the macro (Advanced)
<details>
<summary>Click to expand</summary>
The macro will attempt to draw each row of the image from top to bottom, left to right. This isn't the fastest way to print, but this is safer because desyncs are expected, by printing one line at a time it's easier to either repair desynchronized lines manually using the selection tool in game or run the macro skiping lines that were already drawn.   

To minimize the amount of time spent selecting colors, the macro will try to "preload" up to 9 colors used in the current row into the game palette, however, if a line contains more than 9 colors, the macro will need to stop drawing in the middle of the line to change color, when this occurs the macro will either:
1. Replace a color were all the pixels were already drawn for that line
2. Replace the color with the closest color code to the one we are trying to reach.

Before starting a row or changing the color state, a comment line is added in the macro, this comment line is ignored by NXBT, but the custom python script that comes with this project prints those comments to the console and takes an optional argument that allows starting a macro from a given comment checkpoint.

| Comment type | Description |
| ------------ | ----------- |
| #y.xr# Start row | Starting from the line y at the xth pixel the next operation is moving to the next row |
| #y.xs# Color switch Slot n -> m | From the line y at the xth pixel the next operation is to press Y and change color from the nth slot to the mth slot |
| #y.xs# Color pick Slot n -> m : c1 -> c2 | From the line y at the xth pixel the next operation is to press Y and move from the nth slot to the mth slot then press Y again to change the color in the m slot from c1 to c2 |

*Note: (x, y) coordinates start at 0 the starting point of a macro is (0, 0)*   
*Note: Color slots are numbered from 0 at the top to 8 at the bottom*
</details>

### Preparing the game
TODO steps to prepare the game to receive the macro inputs

### Running the macro
NXBT has built-in tools to run macros, however, in my tests, it wasn't very reliable at parsing a large macro with looping inputs efficiently causing disconnects before the macro could start.
If you experience similar issues, a custom python script is included in this project to read the macro and pass it step by step to NXBT.

#### Using NXBT macro command
TODO instructions

#### Using NXBT webapp
TODO instructions

#### Using the custom python script
TODO instructions

### While the macro is running
TODO warnings about desync

<hr>

*This project is not affiliated to Nintendo, the Living the Grid site or the NXBT software.* <br>
*Thank you to the respective authors of the tools that make this possible.*
