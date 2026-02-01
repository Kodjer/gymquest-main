import re
import urllib.request
import urllib.error
import json

def check_youtube_video(video_id):
    """Проверяет доступность YouTube видео"""
    try:
        url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req, timeout=10)
        return response.status == 200
    except Exception as e:
        return False

# Читаем файл
with open('src/lib/questBank.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Извлекаем все уникальные YouTube ID
pattern = r'youtube\.com/embed/([a-zA-Z0-9_-]+)'
video_ids = set(re.findall(pattern, content))

print(f"Найдено уникальных видео: {len(video_ids)}")
print("\nПроверяю доступность...\n")

available = {}
unavailable = []

for i, video_id in enumerate(video_ids, 1):
    print(f"[{i}/{len(video_ids)}] Проверяю {video_id}...", end=" ")
    is_available = check_youtube_video(video_id)
    if is_available:
        available[video_id] = f"https://www.youtube.com/embed/{video_id}"
        print("✓ доступно")
    else:
        unavailable.append(video_id)
        print("✗ недоступно")

print(f"\n\n{'='*50}")
print(f"Итого:")
print(f"Доступно: {len(available)}")
print(f"Недоступно: {len(unavailable)}")

if unavailable:
    print(f"\nНедоступные видео:")
    for vid in unavailable:
        print(f"  - {vid}")

# Сохраняем результаты
with open('video_check_results.json', 'w', encoding='utf-8') as f:
    json.dump({
        'available': list(available.keys()),
        'unavailable': unavailable
    }, f, indent=2, ensure_ascii=False)

print("\nРезультаты сохранены в video_check_results.json")
