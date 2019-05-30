
enum MBCType {
    'ROM ONLY' = 0x00,
    'MBC5' = 0x19,
    'MBC1' = 0x01,
    'MBC5 + RAM' = 0x1A,
    'MBC1 + RAM' = 0x02,
    'MBC5 + RAM + BATTERY' = 0x1B,
    'MBC1 + RAM + BATTERY' = 0x03,
    'MBC5 + RUMBLE' = 0x1C,
    'MBC2' = 0x05,
    'MBC5 + RUMBLE + RAM' = 0x1D,
    'MBC2 + BATTERY' = 0x06,
    'MBC5 + RUMBLE + RAM + BATTERY' = 0x1E,
    'ROM + RAM' = 0x08,
    'MBC6' = 0x20,
    'ROM + RAM + BATTERY' = 0x09,
    'MBC7 + SENSOR + RUMBLE + RAM + BATTERY' = 0x22,
    'MMM01' = 0x0B,
    'MMM01 + RAM' = 0x0C,
    'MMM01 + RAM + BATTERY' = 0x0D,
    'MBC3 + TIMER + BATTERY' = 0x0F,
    'MBC3 + TIMER + RAM + BATTERY' = 0x10,
    'POCKET CAMERA' = 0xFC,
    'MBC3' = 0x11,
    'BANDAI TAMA5' = 0xFD,
    'MBC3 + RAM' = 0x12,
    'HuC3' = 0xFE,
    'MBC3 + RAM + BATTERY' = 0x13,
    'HuC1 + RAM + BATTERY' = 0xFF
}

export default MBCType
