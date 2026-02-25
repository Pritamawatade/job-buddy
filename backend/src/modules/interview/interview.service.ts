import {  Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import axios from 'axios';
import { env } from '../../config/env';

const generateRealTimeToken = asyncHandler(
  async (req: Request, res: Response) => {
    const response = await axios.post(
      'https://api.openai.com/v1/realtime/client_secrets',
      {
        session: {
          type: 'realtime',
          model: 'gpt-realtime',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(200).json({ value: response.data.value });
  }
);

export { generateRealTimeToken };
