def is_ean13(code: str) -> bool:
    if len(code) != 13:
        return False

    digits = [int(d) for d in code]
    
    checksum = sum(digits[i] if i % 2 == 0 else digits[i] * 3 for i in range(12))
    check_digit = (10 - (checksum % 10)) % 10

    return digits[12] == check_digit

def is_upca(code: str) -> bool:
    if len(code) != 12:
        return False
    
    digits = [int(d) for d in code]

    checksum = sum(digits[i] * 3 if i % 2 == 0 else digits[i] for i in range(11))
    check_digit = (10 - (checksum % 10)) % 10

    return digits[11] == check_digit

def is_ean8(code: str) -> bool:
    if len(code) != 8:
        return False
    
    digits = [int(d) for d in code]

    checksum = sum(digits[i] * 3 if i % 2 == 0 else digits[i] for i in range(7))
    check_digit = (10 - (checksum % 10)) % 10

    return digits[7] == check_digit