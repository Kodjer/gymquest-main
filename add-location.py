#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Скрипт для добавления поля location во все квесты в questBank.ts
"""

import re

# Правила для location
LOCATION_RULES = {
    # home - без инвентаря
    'home': [
        'отжимания', 'приседания для', 'приседания с паузой', 'приседания с увеличенным',
        'медленные приседания', 'планка', 'выпады', 'темповые', 'сумо',
        'растяжка', 'йога', 'медитация', 'водный баланс', 'здоровый', 'день без', 
        'полноценное питание', 'детокс', 'активный отдых', 'полный день', 'утренняя'
    ],
    # gym - нужен инвентарь
    'gym': [
        'с весом', 'с гантелями', 'тяга в наклоне', 'плавание', 'приседания с весом',
        'выпады с гантелями', 'с дефицитом'
    ],
    # both - можно везде
    'both': [
        'прогулка', 'бег', 'прыжки', 'велопрогулка', 'ходьба', 'hiit', 'велозаезд',
        'велогонка', 'спринты', 'пробежка'
    ]
}

def determine_location(title: str) -> str:
    """Определяет location по названию квеста"""
    title_lower = title.lower()
    
    # Проверяем gym
    for keyword in LOCATION_RULES['gym']:
        if keyword in title_lower:
            return 'gym'
    
    # Проверяем both
    for keyword in LOCATION_RULES['both']:
        if keyword in title_lower:
            return 'both'
    
    # По умолчанию home
    return 'home'

def add_location_to_quests(file_path: str):
    """Добавляет location ко всем квестам"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Находим все блоки квестов
    # Ищем: baseXP: NUMBER, \n любые пробелы visualDemo
    pattern = r'(baseXP: \d+,)\n(\s+)(visualDemo:)'
    
    def replacer(match):
        title_search = re.search(r'title: "([^"]+)"', content[:match.start()])
        if title_search:
            # Находим последний title перед текущим совпадением
            all_titles = list(re.finditer(r'title: "([^"]+)"', content[:match.start()]))
            if all_titles:
                last_title = all_titles[-1].group(1)
                location = determine_location(last_title)
                print(f"Adding location '{location}' for quest: {last_title}")
                return f'{match.group(1)}\n{match.group(2)}location: "{location}",\n{match.group(2)}{match.group(3)}'
        
        return match.group(0)
    
    # Заменяем
    new_content = re.sub(pattern, replacer, content)
    
    # Сохраняем
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    # Подсчитываем результат
    location_count = len(re.findall(r'location:', new_content))
    print(f"\n✅ Done! Added location to {location_count} quests")

if __name__ == '__main__':
    file_path = r'c:\Users\Кишкодер17\gymquest\src\lib\questBank.ts'
    add_location_to_quests(file_path)
