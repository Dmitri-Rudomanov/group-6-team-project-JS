# Parcel boilerplate

## Скрытые файлы

Включите отображение скрытых файлов и папок в проводнике своей операционной системы, иначе вы не
сможете выбрать и скопировать себе файлы настроек проекта, имена которых начинаются с точки.

## Зависимости

На компьютере должена быть установлена LTS-версия [Node.js](https://nodejs.org/en/) со всеми
дополнительными инструментами кроме **Chocolatey** - его ставить не нужно.

## Перед началом работы

Один раз на проект установить все зависимости.

```shell
npm ci
```

### Разработка

Запустить режим разработки.

```shell
npm run dev
```

Во вкладке браузера перейти по адресу [http://localhost:1234](http://localhost:1234).

### Деплой

Сборка будет автоматически собирать и деплоить продакшен версию проекта на GitHub Pages, в ветку
`gh-pages`, каждый раз когда обновляется ветка `main`. Например, после прямого пуша или принятого
пул-реквеста. Для этого необходимо в файле `package.json` отредактировать поле `homepage` и скрипт
`build`, заменив `имя_пользователя` и `имя_репозитория` на свои.

```json
"homepage": "https://имя_пользователя.github.io/имя_репозитория",
"scripts": {
  "build": "parcel build src/*.html --public-url /имя_репозитория/"
},
```

На всякий случай стоит зайти в настройки репозитория `Settings` > `Pages` и убедиться что продакшен
версии файлов раздаются из папки `/root` ветки `gh-pages`.

Через какое-то время живую страницу можно будет посмотреть по адресу указанному в отредактированном
свойстве `homepage`, например
[https://goitacademy.github.io/parcel-project-template](https://goitacademy.github.io/parcel-project-template).

## Файлы и папки

- Все паршалы файлов стилей должны лежать в папке `src/sass` и импортироваться в
  `src/sass/main.scss`
- Изображения добавляйте в папку `src/images`, заранее оптимизировав их. Сборщик просто копирует
  используемые изображения чтобы не нагружать систему оптимизацией картинок, так как на слабых
  компьютерах это может занять много времени.

https://image.tmdb.org/t/p/original${poster_path}

${results.title}

${results.vote_average}

${results.vote_count}

${results.original_title}

${overview}

const genres =[ {id:28, name:'Action'} {id:12, name:'Adventure'} {id:878, name:'Science Fiction'} ]

srcset="https://image.tmdb.org/t/p/w300_and_h450_bestv2${results.poster_path}} 1x,
"https://image.tmdb.org/t/p/w600_and_h900_bestv2/${results.poster_path}} 2x"

Основаная

<!-- <img src="https://image.tmdb.org/t/p/original${results.poster_path}" alt="Original poster:${results.title}"  class="movie-img movie-img__modal" > -->

<!-- <img
  class="movie-img movie-img__modal"
  srcset="https://image.tmdb.org/t/p/w300_and_h450_bestv2${results.poster_path}} 1x,
https://image.tmdb.org/t/p/w600_and_h900_bestv2/${results.poster_path}}2x"
  sizes="100vw"
  src="https://image.tmdb.org/t/p/original${results.poster_path}"
  alt="Original poster:${results.title}"
/> -->

<!-- <picture>
<img class="movie-img movie-img__modal" src="https://image.tmdb.org/t/p/original${results.poster_path}" alt="Original poster:${results.title}">
      <source srcset="https://image.tmdb.org/t/p/w300_and_h450_bestv2${results.poster_path}} 1x" media="(max-width: 600px)" sizes="(min-width: 480px) 480px, 100vw">
      <source srcset="https://image.tmdb.org/t/p/w600_and_h900_bestv2/${results.poster_path}}2x" media="(min-width: 601px)" sizes="(min-width: 800px) 800px, 100vw">

    </picture> -->
