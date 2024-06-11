import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { FullUser } from '@/types';

async function getApplicationAccessToken() {
    try {
        const response = await axios.post(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
            client_id: process.env.AUTH0_M2M_CLIENT_ID,
            client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
            audience: process.env.AUTH0_M2M_AUDIENCE,
            grant_type: 'client_credentials',
        });

        const token = response.data.access_token;

        return token;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error fetching application access token: ${error.message}`);
            console.error(error.response?.data); // Log the response data for more insights
            throw new Error(`Error fetching application access token: ${error.message}`);
        }
        throw new Error('Unknown error fetching application access token');
    }
}

export const GET = withApiAuthRequired(async () => {
    const accessToken = await getApplicationAccessToken();

    try {
        const response = await axios.get<FullUser[]>(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return NextResponse.json(response.data.map((user => user.name)));
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching users:', error.message);
            console.error('Response data:', error.response?.data); // Log the response data for more insights
            return NextResponse.json({ error: error.message }, { status: error.response?.status });
        }
        throw new Error('Unknown error fetching users');
    }
});
