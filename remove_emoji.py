import re

with open('src/lib/questBank.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Замена эмодзи-цифр
content = content.replace('1️⃣', '1.')
content = content.replace('2️⃣', '2.')
content = content.replace('3️⃣', '3.')
content = content.replace('4️⃣', '4.')
content = content.replace('5️⃣', '5.')
content = content.replace('6️⃣', '6.')
content = content.replace('7️⃣', '7.')
content = content.replace('8️⃣', '8.')
content = content.replace('9️⃣', '9.')
content = content.replace('🔟', '10.')

# Очистка thumbnail
content = re.sub(r'thumbnail:\s*"[^"]*"', 'thumbnail: ""', content)

with open('src/lib/questBank.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done!')
