interface Props {
  status: number
  body?: unknown
}

// Заголовки для кодов, задокументированных в TIHA-CLAUDE.md/endpoints.md
const TITLES: Record<number, string> = {
  400: 'Некорректный запрос',
  401: 'Не авторизован',
  403: 'Доступ запрещён',
  404: 'Не найдено',
  409: 'Конфликт',
  413: 'Файл слишком большой',
  415: 'Недопустимый формат файла',
  502: 'Сервис недоступен',
}

export function ErrorPage({ status, body }: Props) {
  return (
    <main>
      <h1>
        {status} — {TITLES[status] ?? 'Ошибка'}
      </h1>
      {body !== undefined && <pre>{JSON.stringify(body, null, 2)}</pre>}
    </main>
  )
}
