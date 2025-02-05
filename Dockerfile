# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.13.1

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /app


################################################################################
# Create a stage for installing dependencies.
COPY package.json package-lock.json ./
RUN npm install

################################################################################
# Create a stage for building the application.
# Copy the rest of the source files into the image.
COPY prisma ./prisma
RUN npx prisma generate

COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application in development mode.
CMD npm run dev
