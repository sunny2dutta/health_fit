# 1. Use Node base image
FROM node:20

# 2. Set working directory
WORKDIR /usr/src/app

# 3. Copy dependencies first for faster caching
COPY package*.json ./
RUN npm install

# 4. Copy the rest of your code
COPY . .

# --- CRITICAL: THE NEW LINES FOR GOOGLE SIGN-IN ---
# This pulls the variable from your Cloud Build Trigger
ARG _VITE_GOOGLE_CLIENT_ID

# This makes it available to Vite as VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$_VITE_GOOGLE_CLIENT_ID
# --------------------------------------------------

# 5. Build your Vite app
# Vite will now "see" the variable and bake it into the JS
RUN npm run build

# 6. Setup the server to host the static files
RUN npm install -g serve
EXPOSE 8080

# 7. Start the app
CMD ["serve", "-s", "dist", "-l", "8080"]
