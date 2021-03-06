
/**
 * Object interface for constructing new SmartBuffer instances.
 */
interface SmartBufferOptions {
    // Buffer Encoding to use for reading/writing strings if one is not provided.
    encoding?: BufferEncoding;
    // The initial size of the internal Buffer.
    size?: number;
    // If a Buffer is provided, this Buffer's value will be used as the internal Buffer.
    buff?: Buffer;
}

// The default Buffer size if one is not provided.
const DEFAULT_SMARTBUFFER_SIZE = 4096;

// The default string encoding to use for reading/writing strings. 
const DEFAULT_SMARTBUFFER_ENCODING = 'utf8';

class SmartBuffer {
    public length: number = 0;
    public encoding: BufferEncoding = DEFAULT_SMARTBUFFER_ENCODING;

    private buff: Buffer;
    private writeOffset: number = 0;
    private readOffset: number = 0;

    /**
     * Creates a new SmartBuffer instance with the provided internal Buffer size and optional encoding.
     * 
     * @param size { Number } The size of the internal Buffer.
     * @param encoding { String } The BufferEncoding to use for strings.
     * 
     * @return { SmartBuffer }
     */
    public static fromSize(size: number, encoding?: BufferEncoding): SmartBuffer {
        return new this({
            size: size,
            encoding: encoding
        });
    }

    /**
     * Creates a new SmartBuffer instance with the provided Buffer and optional encoding.
     * 
     * @param buffer { Buffer } The Buffer to use as the internal Buffer value.
     * @param encoding { String } The BufferEncoding to use for strings.
     * 
     * @return { SmartBuffer }
     */
    public static fromBuffer(buff: Buffer, encoding?: BufferEncoding): SmartBuffer {
        return new this({
            buff: buff,
            encoding: encoding
        });
    }

    /**
     * Creates a new SmartBuffer instance with the provided SmartBufferOptions options.
     * 
     * @param options { SmartBufferOptions } The options to use when creating the SmartBuffer instance.
     */
    public static fromOptions(options: SmartBufferOptions): SmartBuffer {
        return new this(options);
    }

    /**
     * Type checking function that determines if an object is a SmartBufferOptions object.
     */
    static isSmartBufferOptions(options: SmartBufferOptions): options is SmartBufferOptions {
        const castOptions = (<SmartBufferOptions>options);

        return castOptions && (castOptions.encoding !== undefined || castOptions.size !== undefined || castOptions.buff !== undefined);
    }


    /**
     * Creates a new SmartBuffer instance.
     * 
     * @param arg1 { Number | BufferEncoding | Buffer | SmartBufferOptions }
     * @param arg2 { BufferEncoding }
     */
    constructor(arg1?: number | BufferEncoding | Buffer | SmartBufferOptions, arg2?: BufferEncoding) {
        
        // Initial buffer size provided
        if (typeof arg1 === 'number') {
            
            if (Number.isFinite(arg1) && Number.isInteger(arg1) && arg1 > 0) {
                this.buff = Buffer.allocUnsafe(arg1);
            } else {
                throw new Error('Invalid size provided. Size must be a valid integer greater than zero.');
            }
        // String Encoding Provided
        } else if (typeof arg1 === 'string') { 
            if (Buffer.isEncoding(arg1)) {
                this.buff = Buffer.allocUnsafe(DEFAULT_SMARTBUFFER_SIZE);
                this.encoding = arg1;
            } else {
                throw new Error('Invalid encoding provided. Please specify a valid encoding the internal Node.js Buffer supports.');
            }
        // Buffer instance provided
        } else if (arg1 instanceof Buffer) {
            this.buff = arg1;
            this.length = arg1.length;
        } else if (SmartBuffer.isSmartBufferOptions(arg1)) {

            // Checks for encoding
            if (arg1.encoding) {
                if (Buffer.isEncoding(arg1.encoding)) {
                    this.encoding = arg1.encoding;
                } else {
                    throw new  Error('Invalid encoding provided. Please specify a valid encoding the internal Node.js Buffer supports.');
                }
            }

            // Checks for initial size length
            if (arg1.size) {
                if (Number.isFinite(arg1.size) && Number.isInteger(arg1.size) && arg1.size > 0) {
                    this.buff = Buffer.allocUnsafe(arg1.size);
                } else {
                    throw new Error('Invalid size provided. Size must be a valid integer greater than zero.');
                }
                // Check for initial Buffer
            } else if (arg1.buff) {
                if (arg1.buff instanceof Buffer) {
                    this.buff = arg1.buff;
                    this.length = arg1.buff.length;
                } else {
                    throw new Error('Invalid buffer provided in SmartBufferOptions.');
                }
            } else {
                this.buff = Buffer.allocUnsafe(DEFAULT_SMARTBUFFER_SIZE);
            }
        } else if (typeof arg1 === 'object') {
            throw new Error('Invalid object supplied to SmartBuffer constructor.');
        } else {
            this.buff = Buffer.allocUnsafe(DEFAULT_SMARTBUFFER_SIZE);
        }

        // Check for encoding (Buffer, Encoding) constructor.
        if (typeof arg2 === 'string') {
            if (Buffer.isEncoding(arg2)) {
                this.encoding = arg2;
            } else {
                throw new Error('Invalid encoding provided. Please specify a valid encoding the internal Node.js Buffer supports.');
            }
        }
    }

    // Signed integers

    /**
     * Reads an Int8 value from the current read position.
     * 
     * @return { Number }
     */
    readInt8(): number {
        return this.readNumberValue(Buffer.prototype.readInt8, 1);
    }

    /**
     * Reads an Int16BE value from the current read position.
     * 
     * @return { Number }
     */
    readInt16BE(): number {
        return this.readNumberValue(Buffer.prototype.readInt16BE, 2);
    }

    /**
     * Reads an Int16LE value from the current read position.
     * 
     * @return { Number }
     */
    readInt16LE(): number {
        return this.readNumberValue(Buffer.prototype.readInt16LE, 2);
    }

    /**
     * Reads an Int32BE value from the current read position.
     * 
     * @return { Number }
     */
    readInt32BE(): number {
        return this.readNumberValue(Buffer.prototype.readInt32BE, 4);
    }

    /**
     * Reads an Int32LE value from the current read position.
     * 
     * @return { Number }
     */
    readInt32LE(): number {
        return this.readNumberValue(Buffer.prototype.readInt32LE, 4);
    }

    /**
     * Writes an Int8 value to the current write position (or at optional offset).
     * 
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     * 
     * @return this
     */
    writeInt8(value: number, offset?: number): SmartBuffer {
        this.writeNumberValue(Buffer.prototype.writeInt8, 1, value, offset);
        return this;
    }

    /**
     * Writes an Int16BE value to the current write position (or at optional offset).
     * 
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     * 
     * @return this
     */
    writeInt16BE(value: number, offset?: number): SmartBuffer {
        this.writeNumberValue(Buffer.prototype.writeInt16BE, 2, value, offset);
        return this;
    }

    /**
     * Writes an Int16LE value to the current write position (or at optional offset).
     * 
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     * 
     * @return this
     */
    writeInt16LE(value: number, offset?: number): SmartBuffer {
        this.writeNumberValue(Buffer.prototype.writeInt16LE, 2, value, offset);
        return this;
    }

    /**
     * Writes an Int32BE value to the current write position (or at optional offset).
     * 
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     * 
     * @return this
     */
    writeInt32BE(value: number, offset?: number): SmartBuffer {
        this.writeNumberValue(Buffer.prototype.writeInt32BE, 4, value, offset);
        return this;
    }

    /**
     * Writes an Int32LE value to the current write position (or at optional offset).
     * 
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     * 
     * @return this
     */
    writeInt32LE(value: number, offset?: number): SmartBuffer {
        this.writeNumberValue(Buffer.prototype.writeInt32LE, 4, value, offset);
        return this;
    }

    // Unsigned Integers

    /**
     * Reads an UInt8 value from the current read position.
     * 
     * @return { Number }
     */
    readUInt8(): number {
        return this.readNumberValue(Buffer.prototype.readUInt8, 1);
    }

    /**
     * Reads an UInt16BE value from the current read position.
     * 
     * @return { Number }
     */
    readUInt16BE(): number {
        return this.readNumberValue(Buffer.prototype.readUInt16BE, 2);
    }

    /**
     * Reads an UInt16LE value from the current read position.
     * 
     * @return { Number }
     */
    readUInt16LE(): number {
        return this.readNumberValue(Buffer.prototype.readUInt16LE, 2);
    }

    /**
     * Reads an UInt32BE value from the current read position.
     * 
     * @return { Number }
     */
    readUInt32BE(): number {
        return this.readNumberValue(Buffer.prototype.readUInt32BE, 4);
    }

    /**
     * Reads an UInt32LE value from the current read position.
     * 
     * @return { Number }
     */
    readUInt32LE(): number {
        return this.readNumberValue(Buffer.prototype.readUInt32LE, 4);
    }

    /**
     * Writes an UInt8 value to the current write position (or at optional offset).
     * 
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     * 
     * @return this
     */
    writeUInt8(value: number, offset?: number): SmartBuffer {
        this.writeNumberValue(Buffer.prototype.writeUInt8, 1, value, offset);
        return this;
    }

    /**
     * Writes an UInt16BE value to the current write position (or at optional offset).
     * 
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     * 
     * @return this
     */
    writeUInt16BE(value: number, offset?: number): SmartBuffer {
        this.writeNumberValue(Buffer.prototype.writeUInt16BE, 2, value, offset);
        return this;
    }

    /**
     * Writes an UInt16LE value to the current write position (or at optional offset).
     * 
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     * 
     * @return this
     */
    writeUInt16LE(value: number, offset?: number): SmartBuffer {
        this.writeNumberValue(Buffer.prototype.writeUInt16LE, 2, value, offset);
        return this;
    }

    /**
     * Writes an UInt32BE value to the current write position (or at optional offset).
     * 
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     * 
     * @return this
     */
    writeUInt32BE(value: number, offset?: number): SmartBuffer {
        this.writeNumberValue(Buffer.prototype.writeUInt32BE, 4, value, offset);
        return this;
    }

    /**
     * Writes an UInt32LE value to the current write position (or at optional offset).
     * 
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     * 
     * @return this
     */
    writeUInt32LE(value: number, offset?: number): SmartBuffer {
        this.writeNumberValue(Buffer.prototype.writeUInt32LE, 4, value, offset);
        return this;
    }

    // Floating Point


    /**
     * Reads an FloatBE value from the current read position.
     * 
     * @return { Number }
     */
    readFloatBE(): number {
        return this.readNumberValue(Buffer.prototype.readFloatBE, 4);
    }

    /**
     * Reads an FloatLE value from the current read position.
     * 
     * @return { Number }
     */
    readFloatLE(): number {
        return this.readNumberValue(Buffer.prototype.readFloatLE, 4);
    }

    /**
     * Writes a FloatBE value to the current write position (or at optional offset).
     * 
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     * 
     * @return this
     */
    writeFloatBE(value: number, offset?: number): SmartBuffer {
        this.writeNumberValue(Buffer.prototype.writeFloatBE, 4, value, offset);
        return this;
    }

    /**
     * Writes a FloatLE value to the current write position (or at optional offset).
     * 
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     * 
     * @return this
     */
    writeFloatLE(value: number, offset?: number): SmartBuffer {
        this.writeNumberValue(Buffer.prototype.writeFloatLE, 4, value, offset);
        return this;
    }


    // Double Floating Point

    /**
     * Reads an DoublEBE value from the current read position.
     * 
     * @return { Number }
     */
    readDoubleBE(): number {
        return this.readNumberValue(Buffer.prototype.readDoubleBE, 8);
    }

    /**
     * Reads an DoubleLE value from the current read position.
     * 
     * @return { Number }
     */
    readDoubleLE(): number {
        return this.readNumberValue(Buffer.prototype.readDoubleLE, 8);
    }

    /**
     * Writes a DoubleBE value to the current write position (or at optional offset).
     * 
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     * 
     * @return this
     */
    writeDoubleBE(value: number, offset?: number): SmartBuffer {
        this.writeNumberValue(Buffer.prototype.writeDoubleBE, 8, value, offset);
        return this;
    }

    /**
     * Writes a DoubleLE value to the current write position (or at optional offset).
     * 
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     * 
     * @return this
     */
    writeDoubleLE(value: number, offset?: number): SmartBuffer {
        this.writeNumberValue(Buffer.prototype.writeDoubleLE, 8, value, offset);
        return this;
    }


    // Strings

    /**
     * Reads a String from the current read position.
     * 
     * @param length { Number } The number of bytes to read as a String.
     * @param encoding { String } The BufferEncoding to use for the string (Defaults to instance level encoding).
     * 
     * @return { String }
     */
    readString(length?: number, encoding?: BufferEncoding): string {
        const lengthVal = (typeof length === 'number') ? Math.min(length, this.length - this.readOffset) : this.length - this.readOffset;
        const value = this.buff.slice(this.readOffset, this.readOffset + lengthVal).toString(encoding || this.encoding);

        this.readOffset += lengthVal;
        return value;
    }

    /**
     * Writes a String to the current write position.
     * 
     * @param value { String } The String value to write.
     * @param arg2 { Number | String } The offset to write the string to, or the BufferEncoding to use.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     */
    writeString(value: string, arg2?: number | BufferEncoding, encoding?: BufferEncoding) {
        let offsetVal = this.writeOffset;
        let encodingVal = this.encoding;

        // Check for offset
        if (typeof arg2 === 'number') {
            offsetVal = arg2;
        // Check for encoding
        } else if (typeof arg2 === 'string') {
            if (Buffer.isEncoding(arg2)) {
                encodingVal = arg2;
            } else {
                throw new Error('Invalid encoding provided. Please specify a valid encoding the internal Node.js Buffer supports.');
            }
        }

        // Check for encoding (third param)
        if (typeof encoding === 'string') {
            if (Buffer.isEncoding(encoding)) {
                encodingVal = encoding;
            } else {
                throw new Error('Invalid encoding provided. Please specify a valid encoding the internal Node.js Buffer supports.');
            }
        }

        // Calculate bytelength of string.
        const byteLength = Buffer.byteLength(value, encodingVal);
        
        // Ensure there is enough internal Buffer capacity.
        this.ensureWriteable(byteLength, offsetVal);

        // Write value
        this.buff.write(value, offsetVal, byteLength, encodingVal);

        // Increment internal Buffer write offset;
        this.writeOffset += byteLength;
        return this;
    }

    /**
     * Reads a null-terminated String from the current read position.
     * 
     * @param encoding { String } The BufferEncoding to use for the string (Defaults to instance level encoding).
     * 
     * @return { String }
     */
    readStringNT(encoding?: BufferEncoding): string {

        // Set null character position to the end SmartBuffer instance.
        let nullPos = this.length;

        // Find next null character (if one is not found, default from above is used)
        for (let i = this.readOffset; i < this.length; i++) {
            if (this.buff[i] === 0x00) {
                nullPos = i;
                break;
            }
        }

        // Read string value
        const value = this.buff.slice(this.readOffset, nullPos);

        // Increment internal Buffer read offset
        this.readOffset = nullPos + 1;

        return value.toString(encoding || this.encoding);
    }

    /**
     * Writes a null-terminated String to the current write position.
     * 
     * @param value { String } The String value to write.
     * @param arg2 { Number | String } The offset to write the string to, or the BufferEncoding to use.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     */
    writeStringNT(value: string, offset?: number | BufferEncoding, encoding?: BufferEncoding) {
        // Write Values
        this.writeString(value, offset, encoding);
        this.writeUInt8(0x00, (typeof offset === 'number' ? offset + value.length : this.writeOffset));
    }

    // Buffers

    /**
     * Reads a Buffer from the internal read position.
     * 
     * @param length { Number } The length of data to read as a Buffer.
     * 
     * @return { Buffer }
     */
    readBuffer(length?: number): Buffer {
        const lengthVal = typeof length === 'number' ? length : this.length;
        const endPoint = Math.min(this.length, this.readOffset + lengthVal);

        // Read buffer value
        const value = this.buff.slice(this.readOffset, endPoint);

        // Increment internal Buffer read offset
        this.readOffset = endPoint;
        return value;
    }

    /**
     * Writes a Buffer to the current write position.
     * 
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     */
    writeBuffer(value: Buffer, offset?: number) {
        const offsetVal = typeof offset === 'number' ? offset : this.writeOffset;
        
        // Ensure there is enough internal Buffer capacity.
        this.ensureWriteable(value.length, offsetVal);

        // Write buffer value
        value.copy(this.buff, offsetVal);

        // Increment internal Buffer write offset
        this.writeOffset += value.length;
        return this;
    }

    /**
     * Reads a null-terminated Buffer from the current read poisiton.
     * 
     * @return { Buffer }
     */
    readBufferNT(): Buffer {
        // Set null character position to the end SmartBuffer instance.
        let nullPos = this.length;
      
        // Find next null character (if one is not found, default from above is used)
        for (let i = this.readOffset; i < this.length; i++) {
            if (this.buff[i] === 0x00) {
                nullPos = i;
                break;
            }
        }

        // Read value
        const value = this.buff.slice(this.readOffset, nullPos);

        // Increment internal Buffer read offset
        this.readOffset = nullPos + 1;
        return value;
    }

    /**
     * Writes a null-terminated Buffer to the current write position.
     * 
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     */
    writeBufferNT(value: Buffer, offset?: number) {
        // Write Values
        this.writeBuffer(value, offset);
        this.writeUInt8(0, (typeof offset === 'number' ? offset + value.length : this.writeOffset));

        return this;
    }

    /**
     * Clears the SmartBuffer instance to its original empty state.
     */
    clear() {
        this.writeOffset = 0;
        this.readOffset = 0;
        this.length = 0;
    }
	
    /**
     * Remove data from buffer. The buffer internal storage size remains the same, however the data following 
	 * the offset will be back shifted. Data length, write/read offset will be fix if it became outside of 
	 * the new data range.
     * @param offset { number } Offset where to start removing data.
     * @param length { number } Length to remove.
     */
    remove(offset: number, length: number) {
        offset = (offset || 0);
        if (offset < 0 || offset > this.writeOffset) {
            throw new Error("Offset position is beyond the bounds of the data.");
        }
        if (offset + length > this.length) {
            throw new Error("Remove position is beyond the bounds of the data.");
        }
        var startingOffsetBackShift = offset + length;
        var endingBackShift = this.length;
        for (var i = startingOffsetBackShift, j = offset; i < endingBackShift; ++i, ++j) {
            this.buff[j] = this.buff[i];
        }
        
        this.length -= length;
        
        if (this.writeOffset > this.length) {
            this.writeOffset = this.length;
        }
        if (this.readOffset > this.length) {
            this.readOffset = this.length;
        }
		return this;
    }	

    /**
     * Gets the remaining data left to be read from the SmartBuffer instance.
     * 
     * @return { Number }
     */
    remaining(): number {
        return this.length - this.readOffset;
    }

    /**
     * Moves the read offset forward.
     * 
     * @param amount { Number } The amount to move the read offset forward by.
     */
    skip(amount: number) {
        if (this.readOffset + amount > this.length) {
            throw new Error('Target position is beyond the bounds of the SmartBuffer size.');
        }

        this.readOffset += amount;
    }

    /**
     * Moves the read offset backwards.
     * 
     * @param amount { Number } The amount to move the read offset backwards by.
     */
    rewind(amount: number) {
        if (this.readOffset - amount < 0) {
            throw new Error('Target position is beyond the bounds of the SmartBuffer size.');
        }

        this.readOffset -= amount;
    }

    /**
     * Moves the read offset to a specific position.
     * 
     * @param position { Number } The position to move the read offset to.
     */
    skipTo(position: number) {
        this.moveTo(position);
    }

    /**
     * Moves the read offset to a specific position.
     * 
     * @param position { Number } The position to move the read offset to.
     */
    moveTo(position: number) {
        if (position > this.length) {
            throw new Error('Target position is beyond the bounds of the SmartBuffer size.');
        }

        this.readOffset = position;
    }

    /**
     * Gets the value of the internal managed Buffer
     * 
     * @param { Buffer }
     */
    toBuffer(): Buffer {
        return this.buff.slice(0, this.length);
    }

    /**
     * Gets the String value of the internal managed Buffer
     * 
     * @param encoding { String } The BufferEncoding to display the Buffer as (defaults to instance level encoding).
     */
    toString(encoding?: BufferEncoding) {
        const encodingVal = typeof encoding === 'string' ? encoding : this.encoding;

        if (Buffer.isEncoding(encodingVal)) {
            return this.buff.toString(encodingVal, 0, this.length);
        } else {
            throw new Error('Invalid encoding provided. Please specify a valid encoding the internal Node.js Buffer supports.');
        }
    }

    /**
     * Destroys the SmartBuffer instance.
     */
    destroy() {
        this.clear();
    }

    /**
     * Ensures that the internal Buffer is large enough to read data.
     *
     * @param length { Number } The length of the data that needs to be read.
     */
    private ensureReadable(length: number) {
        if (this.remaining() < length) {
            throw new Error('Reading beyond the bounds of the data.');
        }
    }

    /**
     * Ensures that the internal Buffer is large enough to write data.
     * 
     * @param minLength { Number } The minimum length of the data that needs to be written.
     * @param offset { Number } The offset of the data to be written.
     */
    private ensureWriteable(minLength: number, offset?: number) {
        const offsetVal = typeof offset === 'number' ? offset : 0;

        // Ensure there is enough internal Buffer capacity.
        this.ensureCapacity(this.length + minLength + offsetVal);

        // If offset is provided, copy data into appropriate location in regards to the offset.
        if (typeof offset === 'number') {
            this.buff.copy(this.buff, offsetVal + minLength, offsetVal, this.buff.length);
        }

        // Adjust instance length.
        this.length = Math.max(this.length + minLength, offsetVal + minLength);
    }


    /**
     * Ensures that the internal Buffer is large enough to write at least the given amount of data.
     * 
     * @param minLength { Number } The minimum length of the data needs to be written.
     */
    private ensureCapacity(minLength: number) {
        const oldLength = this.buff.length;

        if (minLength > oldLength) {
            let data = this.buff;
            let newLength = (oldLength * 3) / 2 + 1;
            if (newLength < minLength) {
                newLength = minLength;
            }
            this.buff = Buffer.allocUnsafe(newLength);

            data.copy(this.buff, 0, 0, oldLength);
        }
    }

    /**
     * Reads a numeric number value using the provided function.
     * 
     * @param func { Function(offset: number) => number } The function to read data on the internal Buffer with.
     * @param byteSize { Number } The number of bytes read.
     * 
     * @param { Number }
     */
    private readNumberValue(func: (offset: number) => number, byteSize: number) {
        this.ensureReadable(byteSize);
        // Call Buffer.readXXXX();
        const value = func.call(this.buff, this.readOffset);

        // Adjust internal read offset
        this.readOffset += byteSize;

        return value;
    }

    /**
     * Writes a numeric number value using the provided function.
     * 
     * @param func { Function(offset: number, offset?) => number} The function to write data on the internal Buffer with.
     * @param byteSize { Number } The number of bytes written.
     * @param value { Number } The number value to write.
     * @param offset { Number } the offset to write the number at.
     * 
     */
    private writeNumberValue(func: (value: number, offset?: number) => number, byteSize: number, value: number, offset?: number) {
        const offsetVal = typeof offset === 'number' ? offset : this.writeOffset;

        // Ensure there is enough internal Buffer capacity. (raw offset is passed)
        this.ensureWriteable(byteSize, offset);

        // Call buffer.writeXXXX();
        func.call(this.buff, value, offsetVal);

        // Adjusts internal write offset
        this.writeOffset += byteSize;
    }
}

export {
    SmartBufferOptions,
    SmartBuffer
};
