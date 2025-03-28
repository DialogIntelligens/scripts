from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
import os

def encrypt_file(input_file, output_file, password):
    try:
        # Read the file content
        with open(input_file, 'rb') as f:
            plaintext = f.read()

        # Generate a random salt
        salt = os.urandom(16)

        # Derive a key from the password
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
            backend=default_backend()
        )
        key = kdf.derive(password.encode())

        # Generate a random initialization vector (IV)
        iv = os.urandom(16)

        # Encrypt the file content using AES
        cipher = Cipher(algorithms.AES(key), modes.CFB(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        ciphertext = encryptor.update(plaintext) + encryptor.finalize()

        # Write the salt, IV, and ciphertext to the output file
        with open(output_file, 'wb') as f:
            f.write(salt + iv + ciphertext)

        print(f"Encrypted {input_file} -> {output_file}")
    except Exception as e:
        print(f"Error encrypting file {input_file}: {e}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 4:
        print("Usage: python encrypter.py <input_file> <output_file> <password>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]
    password = sys.argv[3]
    encrypt_file(input_file, output_file, password)