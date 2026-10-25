# מרכז מורשת יהדות שאלוניקי ויוון

קובצי פרויקט האתר נמצאים בתיקייה **מרכז מורשת**.

## הפעלה מקומית

נדרשת Python 3. מתוך תיקיית המאגר:

```sh
cd "מרכז מורשת"
python3 -m http.server 8000 --directory dist
```

פתחו בדפדפן: http://localhost:8000

## מבנה הפרויקט

- `dist/` — האתר הסטטי: HTML, CSS, JavaScript, תמונות וסרטונים.
- `dist/about/`, `dist/team/`, `dist/founder/`, `dist/collections/`, `dist/galleries/` — העמודים הפנימיים.
- `dist/galleries/` — עמוד ראשי ותשע גלריות, עם 176 תמונות שהועברו מהאתר המקורי.
- `docs/` — הערות עיצוב ומקורות.
- `.openai/hosting.json` — הגדרות האירוח המקוריות ב־Sites.

קוד המקור נשמר בענף `main`. הפרסום מתבצע רק ב־GitHub Pages, דרך ענף `gh-pages` ותיקיית השורש שלו. ענף הפרסום מכיל את תוכן `מרכז מורשת/dist`, עם קידומת `/moreshet/` לנתיבי העמודים והנכסים ועם קובץ `.nojekyll`.

כתובת האתר: https://editadzine-ux.github.io/moreshet/

עמוד הגלריות: https://editadzine-ux.github.io/moreshet/galleries/

מיפוי הגלריות וכתובות התמונות המקוריות נשמר ב־`מרכז מורשת/docs/gallery-migration-20261025.json`.

זהו עותק של פרויקט האתר המעוצב, ולא ארכיון הגיבוי של האתר הישן. חלק מהתוכן מוטמע משירותים חיצוניים; טופס יצירת הקשר נמצא במצב תצוגה מקדימה ואינו שולח פניות.

גרסת מקור: `b7c7d51e0715f7a3d49b22f4782d1bb4fa1547a7`.
