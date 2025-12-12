import subprocess
import json
import sys

class Nexus:
    def __init__(self, bin_path="./nexus"):
        self.bin_path = bin_path

    def run(self, script_path):
        """Run a local script file"""
        return self._exec("run", script_path)

    def install(self, name):
        """Install a script from registry"""
        subprocess.run([self.bin_path, "install", f"@{name}"], check=True)

    def execute(self, entity_name, command=None, args=None):
        """Execute an installed entity"""
        cmd = [f"@{entity_name}"]
        if command:
            cmd.append(command)
        if args:
            cmd.extend(args)
        return self._exec(*cmd)

    def _exec(self, *args):
        # Always request JSON output
        cmd = [self.bin_path] + list(args) + ["--json"]
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            raise Exception(f"Nexus Error: {result.stderr}")
            
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError:
            return {"raw_output": result.stdout}

# Example Usage
if __name__ == "__main__":
    nexus = Nexus(bin_path="nexus") # Assumes nexus.exe is in PATH or current dir
    
    print("Fetching Google Search...")
    try:
        results = nexus.execute("google", "search", ["python bindings"])
        print(json.dumps(results, indent=2))
    except Exception as e:
        print(f"Error: {e}")
