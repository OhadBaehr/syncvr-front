import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import axios from 'axios';


async function getApplicationAccessToken() {
    try {
        const response = await axios.post(`https://${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
            client_id: process.env.AUTH0_M2M_CLIENT_ID,
            client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
            audience: process.env.AUTH0_M2M_AUDIENCE,
            grant_type: 'client_credentials',
        });

        return response.data.access_token;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Error fetching application access token: ${error.message}`);
        }
        throw new Error('Unknown error fetching application access token');
    }
}

export const GET = withApiAuthRequired(async () => {
    const accessToken = await getApplicationAccessToken();

    try {
        const response = await axios.get(`https://${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json({ error: error.message }, { status: error.response?.status });
        }
    }
})