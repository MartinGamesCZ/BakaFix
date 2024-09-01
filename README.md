# BakaFix

BakaFix je sada přídavných nástrojů pro bakaláře.

## Proč?

... protože je co zlepšovat.

## Instalace

1. Naklonujte si tento repozitář
2. Nainstalujte balíčky pomocí `npm install` nebo `bun install`
3. Vytvořte konfigurační soubor config/config.json, více informací v sekci Konfigurace
4. Spusťte server pomocí `npm start` nebo `bun start:bun`

## Konfigurace

Konfigurační soubor je ve formátu JSON a musí být umístěn v adresáři `config/config.json`.

### Příklad konfigurace

```json
{
  "app": {
    "timetable_watcher": {
      "enabled": true,
      "webhook": "https://discord.com/api/webhooks/.../...",
      "class": "64",
      "className": "I2B",
      "timeframe": "Actual"
    }
  },
  "baka": {
    "public": {
      "baseURL": "https://mojeskola.tld/bakaweb"
    }
  }
}
```

## Timetable Watcher

Nástroj, který sleduje změny v rozvrhu a upozorní na ně pomocí discord webhooku.

### Upozornění
- Změny, na které již bylo upozorněno se ukládají v proměnné, tudíž po restartu serveru budou odeslány znovu (na řešení pracuji)
- Chybí podpora pro dělené hodiny, vždy vezme první, co je v rozvrhu
- Testováno pouze na změnách typu odpadlá hodina a obecná absence třídy, na ostatních nemám zatím jak otestovat

### Konfigurace

Konfigurace se nachází v konfiguračním souboru (sekce Konfigurace) pod klíčem `app.timetable_watcher`

- `enabled` - povolit nebo zakázat nástroj
- `webhook` - URL discord webhooku, na který se budou posílat upozornění
- `class` - ID třídy -> alfanumerický kód na konci URL veřejného rozvrhu konkrétní třídy
- `className` - Název třídy -> název třídy, který se zobrazuje v upozornění

## Plánované funkce
- Vylepšený rozvrh
- A další, záleží na nápadech...

### ! Work in progress !

Open to PR
