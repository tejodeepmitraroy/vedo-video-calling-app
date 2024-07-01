import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { nanoid } from 'nanoid';
import prisma from '../lib/prismaClient';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';
import { WithAuthProp } from '@clerk/clerk-sdk-node';

interface ClerkUser {
  id: string;
  firstName: string;
  lastName: string;
  emailAddresses: { id: string; emailAddress: string }[];
  // Add other Clerk user properties if needed
}

// declare global {
//   namespace Express {
//     interface Request {
//       // auth?: {
//       //   user: ClerkUser;
//       // };

//       auth: WithAuthProp;
//     }
//   }
// }

interface ClerkUser {
  userId: string;
  firstName: string;
  lastName: string;
  emailAddresses: { id: string; emailAddress: string }[];
  // Add other Clerk user properties if needed
}

interface AuthenticatedRequest extends Request {
  auth?: WithAuthProp<ClerkUser>;
}

export const getACall = asyncHandler(
  async (request: AuthenticatedRequest, response: Response) => {
    const roomId = request.params.roomId;
    // console.log(roomId);

    try {
      const meetingData = await prisma.meeting.findUnique({
        where: {
          meetingId: roomId
        }
      });

      // console.log(meetingData);

      // if (!meetingData) {
      //   return response.status(400).redirect(`${process.env.FRONTEND_URL}`);
      // }

      return response.status(200).json(new ApiResponse(200, meetingData));
    } catch (error) {
      return response
        .status(400)
        .json(new ApiError(400, 'Error While getting a Call', error));
    }
  }
);

export const createInstantCall = asyncHandler(
  async (request: AuthenticatedRequest, response: Response) => {
    const user = request.auth?.userId;
    const shortId = nanoid(8);

    try {
      const meetingDetails = await prisma.meeting.create({
        data: {
          title: 'Instant Meeting',
          meetingId: shortId,
          videoCallUrl: `${process.env.FRONTEND_URL!}/room/${shortId}`,
          createdById: user!
        }
      });

      // console.log(meetingDetails);
      // return response.redirect(`${meetingDetails.videoCallUrl}`);
      // return response.status(200).redirect("https://youtu.be/Y_GrZ5cIipg?si=EEzUZ2uPK7UQbBJr");
      return response.status(200).json(new ApiResponse(200, meetingDetails));
    } catch (error) {
      return response
        .status(400)
        .json(new ApiError(400, 'Error Happened', error));
    }
  }
);

export const createScheduleCall = asyncHandler(
  async (request: AuthenticatedRequest, response: Response) => {
    const user = request.auth?.userId;
    const shortId = nanoid(8);
    const { title, description, startTime, endTime, participantIds } =
      request.body;
    console.log(request.body);

    try {
      const meetingDetails = await prisma.meeting.create({
        data: {
          title,
          description,
          startTime,
          endTime,
          participantIds: participantIds ? participantIds : [user!],
          meetingId: shortId,
          videoCallUrl: `${process.env.FRONTEND_URL!}/room/${shortId}`,
          createdById: user!
        }
      });

      console.log(meetingDetails);

      return response.status(200).json(new ApiResponse(200, meetingDetails));
    } catch (error) {
      console.log(error);
      return response
        .status(400)
        .json(new ApiError(400, 'Error Happened', error));
    }
  }
);
