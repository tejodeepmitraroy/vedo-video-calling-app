import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import prisma from "../lib/prismaClient";
import ApiError from "../utils/ApiError";
import { Webhook } from "svix";

export const clerkWebhook = asyncHandler(
  async (request: Request, response: Response) => {
    // Get the headers and body
    const headers = request.headers;
    const payload = request.body;

    const { data, type } = payload;
    const { id, email_addresses, first_name, last_name, image_url, username } =
      data;

    // const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    // if (!WEBHOOK_SECRET) {
    //   throw new Error("You need a WEBHOOK_SECRET in your .env");
    // }

    // // Get the Svix headers for verification
    // let svix_id = headers["svix-id"];
    // const svix_timestamp = headers["svix-timestamp"];
    // const svix_signature = headers["svix-signature"];

    // // If there are no Svix headers, error out
    // if (!svix_id || !svix_timestamp || !svix_signature) {
    //   return new Response("Error occured -- no svix headers", {
    //     status: 400,
    //   });
    // }

    // // Create a new Svix instance with your secret.
    // const wh = new Webhook(WEBHOOK_SECRET);

    // let evt;

    // // Attempt to verify the incoming webhook
    // // If successful, the payload will be available from 'evt'
    // // If the verification fails, error out and  return error code
    // try {
    //   evt = wh.verify(payload, {
    //     "svix-id": Array.isArray(svix_id) ? svix_id.join(",") : svix_id,
    //     "svix-timestamp": Array.isArray(svix_timestamp)
    //       ? svix_timestamp.join(",")
    //       : svix_timestamp,
    //     "svix-signature": Array.isArray(svix_signature)
    //       ? svix_signature.join(",")
    //       : svix_signature,
    //   });
    // } catch (err) {
    //   console.log("Error verifying webhook:", new ApiError(400));
    //   return response
    //     .status(400)
    //     .json(new ApiError(400, "Error verifying webhook:", err));
    // }

    // // Do something with the payload
    // // For this guide, you simply log the payload to the console
    // const { id } = evt.data;
    // const eventType = evt.type;
    // console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
    // console.log("Webhook body:", evt.data);

    // return res.status(200).json({
    //   success: true,
    //   message: "Webhook received",
    // });

    console.log("Type of Call-------------->", type);
    console.log("This is DAta---------->", {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url,
      username,
    });

    try {
      switch (type) {
        case "user.created":
          const email = email_addresses[0]
            ? email_addresses[0].email_address
            : "";

          const user = await prisma.user.create({
            data: {
              id,
              email,
              // username: username ? username : "",
              first_name: first_name ? first_name : "",
              last_name: last_name ? last_name : "",
              image_url,
            },
          });
          console.log("User inserted successfully:", user);
          return response.status(200).json({
            success: true,
            message: "Webhook received",
          });

        case "user.updated":
          const updatedUser = await prisma.user.update({
            where: {
              id,
            },
            data: {
              id,
              email,
              // username,
              first_name,
              last_name,
              image_url,
            },
          });

          console.log("User updated successfully:", updatedUser);
          return response.status(200).json({
            success: true,
            message: "Webhook received",
          });

        case "user.deleted":
          console.log("Initated Delete", type);

          const deletedUser = await prisma.user.delete({
            where: {
              id,
            },
          });

          console.log("User Deleted successfully:", deletedUser);
          return response.status(200).json({
            success: true,
            message: "Webhook received",
          });

        default:
          console.log("no parameter hitted");
      }
    } catch (error) {
      console.log("Unexpected error:", error);
      return response.status(400).json({
        success: true,
        message: "Webhook received",
      });
    }
  }
);
