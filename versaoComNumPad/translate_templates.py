#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para adicionar traduções rápidas nos templates HTML
"""

# Mapeamento de strings PT -> chaves de tradução
TRANSLATIONS_MAP = {
    # Modals e Formulários
    'Quem está retirando?': "{{ t('responsible') }}?",
    'Gerenciar Nomes': "{{ t('manage_responsible') }}",
    'Cancelar': "{{ t('cancel') }}",
    'Confirmar': "{{ t('confirm') }}",
    'Gerenciar Responsáveis': "{{ t('manage_responsible') }}",
    'Adicionar novo nome:': "{{ t('add_responsible') }}:",
    'Digite o nome...': "{{ t('responsible_name') }}",
    'Adicionar': "{{ t('add_product') }}",
    'Nomes cadastrados:': "{{ t('responsible') }}:",
    'Concluído': "{{ t('confirm') }}",
    'Fechar modal': "{{ t('close') }}",
    'Outro nome:': "{{ t('responsible_name') }}:",
    'Digite o nome da pessoa...': "{{ t('responsible_name') }}...",
}

print("✅ Mapeamento de traduções criado!")
print(f"📊 Total de {len(TRANSLATIONS_MAP)} strings para traduzir")
print("\n🔍 Exemplos:")
for pt, tkey in list(TRANSLATIONS_MAP.items())[:5]:
    print(f"  '{pt}' → {tkey}")
