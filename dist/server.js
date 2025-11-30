import { createApp } from './app.js';
import { supabase } from './config/supabase.js';
import { UserRepository } from './repositories/UserRepository.js';
import { UserService } from './services/UserService.js';
import { UserController } from './controllers/UserController.js';
import { ChatService } from './services/ChatService.js';
import { ChatController } from './controllers/ChatController.js';
// 1. Dependency Injection Wiring
const userRepository = new UserRepository(supabase);
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const chatService = new ChatService();
const chatController = new ChatController(chatService);
// 2. Initialize App
const app = createApp({ userController, chatController });
// 3. Start Server
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
app.listen(Number(PORT), HOST, () => {
    console.log(`🚀 Production Server running on ${HOST}:${PORT}`);
});
