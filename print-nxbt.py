import nxbt
import sys
import re

nx = nxbt.Nxbt()

# Using your specific reconnect address
controller_index = nx.create_controller(nxbt.PRO_CONTROLLER)

print("Waiting for connection on Change Grip/Order screen...")
nx.wait_for_connection(controller_index)

def stream_macro(file_path, checkpoint):
    with open(file_path, "r") as f:
        loop_count = 0
        loop_buffer = []
        is_in_loop = False

        is_checkpoint_ready = False
        print(checkpoint)

        for line in f:
                
            clean_line = line.strip()
            if not clean_line:
                continue

            if checkpoint and not is_checkpoint_ready and not line.startswith(checkpoint):
                continue

            is_checkpoint_ready = True

            # Check if it's a comment to print
            if line.startswith("#"):
                print(line)
                continue
            

            # Check if the line is indented (belongs to a loop)
            has_indent = line.startswith(" ") or line.startswith("\t")
            
            # Check for LOOP start
            loop_match = re.match(r"LOOP\s+(\d+)", clean_line, re.IGNORECASE)

            if loop_match:
                # If we were already in a loop, flush it first
                if is_in_loop and loop_buffer:
                    for _ in range(loop_count):
                        nx.macro(controller_index, "\n".join(loop_buffer))
                
                loop_count = int(loop_match.group(1))
                loop_buffer = []
                is_in_loop = True
            
            elif is_in_loop and has_indent:
                # Still inside the loop block, just collect the command
                loop_buffer.append(clean_line)
            
            else:
                # We hit a line with no indent, or the file changed context
                if is_in_loop:
                    # Run the buffered loop
                    for _ in range(loop_count):
                        nx.macro(controller_index, "\n".join(loop_buffer))
                    is_in_loop = False
                    loop_buffer = []
                
                # Execute the standard non-loop command
                nx.macro(controller_index, clean_line)

        # Final safety flush if the file ends on an indented block
        if is_in_loop and loop_buffer:
            for _ in range(loop_count):
                nx.macro(controller_index, "\n".join(loop_buffer))

# Initial setup macro
nx.macro(controller_index, """1.0s
A 0.1s
1.0s
B 0.1s
1.0s
HOME 0.1s
1.0s
""")

print("Starting to draw")
# Pass the file path from the first command line argument
stream_macro(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
