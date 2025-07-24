This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Testing

To run the unit tests for the application, you can run the following command:

```bash
npm run test
```

## Quick guide

To start the city search, just start writing the city name in the search bar.

It has a half of the second delay until it actually starts searching to not trigger search every time a letter is typed.

Then, pick the city from the list that appears and click on it to confirm it's the one you want.

Press "search" (the magnifying glass button) to start the search. The button is disabled until the city is confirmed.

After searching, the weather forecast is displayed and the city name is added to the history.

The history persists when refreshing the page and you can quickly select the city again by just clicking on it's chip. To add the city to the deletion queue, click on the "x" mark on the chip. Then the city will be marked as deleted and will be removed from the history on the next refresh. In case you change your mind and don't want to delete the city from history anymore, click on "+" mark on the chip or search for the city again and this way it persists in history.
