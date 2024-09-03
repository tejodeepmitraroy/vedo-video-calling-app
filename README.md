# VEDO - Video Calling App
![Screenshot 2024-09-03 104337](https://github.com/user-attachments/assets/58ecdd06-51ef-46fc-b129-0c20d8f9fc34)

![Screenshot 2024-09-03 104454](https://github.com/user-attachments/assets/cb2bfe24-c961-4e4e-8b8d-f0cba291a57f)

![Screenshot 2024-09-03 104510](https://github.com/user-attachments/assets/9f32c178-d9fc-4a59-a4a1-b3cbf4f3da53)

![Screenshot 2024-09-03 104545](https://github.com/user-attachments/assets/e82988a7-4482-40ac-bca7-ce3989028752)

## 📝Description

V.E.D.O is a WebRTC and SocketIO based Video Calling Application just like Google meet/Zoom meeting but written in Next js and Express js.

This is a video calling app and User can create, call, join, remove another user. This app maintain your call logs. User have a phone book and User can send invite request another user which is not present in friend list.

### 🔨Key Features

- Users can do 1:1/many-screen video meeting
- User can share Meeting link
- Multiple User can Join in a meeting

## 🕸️Tech Stack

1. **Next JS** - Frontend UI
2. **Tailwind CSS** - CSS Framework
3. **Shadcn UI** - Component Library
4. **Zustand** - State Management of whole app
5. **Express.Js** - Backend Framework
6. **Clark** - Authentication of full app
7. **Supabase** - PAAS(Platform as a Service)
8. **PostgreSQL** - Database
9. **Socket Io** - WebSocket
10. **WebRTC** - WebRTC for realtime video,audio sharing
11. **Prisma** - Database Query

## Run The project

### Develop

To develop all apps and packages, run the following command:
``` 
yarn dev
```

To build all apps and packages, run the following command:
``` 
yarn build
```

Run Lint the project
``` 
yarn lint
```

Run Prettier the project
``` 
yarn prettier
```

Find and fix all bugs in project
``` 
yarn fix:all
```



### Apps and Packages

- `server`: a Express js app
- `web`: a Next.js app

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```
