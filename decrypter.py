from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend

def decrypt_file(input_file, output_file, password):
    try:
        # Read the encrypted file content
        with open(input_file, 'rb') as f:
            data = f.read()

        # Extract the salt, IV, and ciphertext
        salt = data[:16]
        iv = data[16:32]
        ciphertext = data[32:]

        # Derive the key from the password
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
            backend=default_backend()
        )
        key = kdf.derive(password.encode())

        # Decrypt the ciphertext
        cipher = Cipher(algorithms.AES(key), modes.CFB(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        plaintext = decryptor.update(ciphertext) + decryptor.finalize()

        # Write the decrypted content to the output file
        with open(output_file, 'wb') as f:
            f.write(plaintext)

        print(f"Decrypted {input_file} -> {output_file}")
    except Exception as e:
        print(f"Error decrypting file {input_file}: {e}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 4:
        print("Usage: python decrypter.py <input_file> <output_file> <password>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]
    password = sys.argv[3]
    decrypt_file(input_file, output_file, password)