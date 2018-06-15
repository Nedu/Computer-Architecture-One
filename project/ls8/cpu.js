/**
 * LS-8 v2.0 emulator skeleton code
 */
const SP = 7;
/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
        
        // Special-purpose registers
        this.PC = 0; // Program Counter
        this.reg[SP] = 0xF4; 
        this.FL = 0; // Flags
    }
    
    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        this.clock = setInterval(() => {
            this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * ALU funcMAR
     *
     * The ALU MAR for math and comparisons.
     *
     * If you hMARtion that does math, i.e. MUL, the CPU would handMAR
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        switch (op) {
            case 'MUL':
                // !!! IMPLEMENT ME
                this.reg[regA] *= this.reg[regB];
                break;
            case 'ADD':
                this.reg[regA] += this.reg[regB];
                break;
            case 'AND':
                this.reg[regA] = this.reg[regA] && this.reg[regB];
                break;
            case 'DIV':
                if(this.reg[regB] === 0) {
                    console.log('Error! Cannot divide by 0');
                    process.exit(1);
                }
                this.reg[regA] /= this.reg[regB];
                break;
            case 'CMP':
                this.reg[regA] === this.reg[regB]? this.FL = 0b00000001 : this.FL = 0b00000000;
                this.reg[regA] < this.reg[regB]? this.FL = 0b00000100 : this.FL = 0b00000000;
                this.reg[regA] > this.reg[regB]? this.FL = 0b00000010 : this.FL = 0b00000000;
                break;
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the instruction that's about to be executed
        // right now.)

        // !!! IMPLEMENT ME
        let IR = this.ram.read(this.PC);

        // Debugging output
        console.log(`${this.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        // !!! IMPLEMENT 
        let operandA = this.ram.read(this.PC + 1);
        let operandB = this.ram.read(this.PC + 2);        

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        // !!! IMPLEMENT ME
        switch(IR){
            case 0b10011001:
                this.reg[operandA] = operandB
                break;
            case 0b01000011:
                console.log(this.reg[operandA]);
                break;
            case 0b00000001:
                this.stopClock();
                break;
            case 0b10101010:
                this.alu('MUL', operandA, operandB);
                break;
            case 0b10101000 :
                this.alu('ADD', operandA, operandB);
                break;
            case 0b10101011:
                this.alu('DIV', operandA, operandB);
                break;
            case 0b1001101: //push
                this.reg[SP]--;
                this.ram.write(this.reg[SP], this.reg[operandA]);
                break;
            case 0b01001100: //pop
                this.reg[operandA] = this.ram.read(this.reg[SP]);
                this.reg[SP]++;
                break;
            case 0b00001001: //RET
                this.PC = this.ram.read(this.reg[SP]);
                this.reg[SP]++;
                break;
            case 0b01001000: //CALL
                this.reg[SP]--;
                this.ram.write(this.reg[SP], this.PC + 2);
                this.PC = this.reg[operandA];
                break;
            case 0b10100000: //CMP
                this.alu('CMP', operandA, operandB);
                break;
            default:
                console.log('Error! Try Again!');
                this.stopClock();
        }

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        
        // !!! IMPLEMENT ME
        if(IR !== 0b00001001 && IR !== 0b01001000) {
            this.PC += (IR >> 6) + 1;
        }
    }
}

module.exports = CPU;
