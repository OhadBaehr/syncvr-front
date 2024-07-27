import { useUser } from "@auth0/nextjs-auth0/client";

export function useUserWithFallback() {
    const { user } = useUser();
    if (!user || !user.email) {
        return {
            user: {
                email: 'default@gmail.com',
                email_verified: false,
                nickname: 'Default',
                name: 'Default'
            }
        };
    }
    return { user };
}