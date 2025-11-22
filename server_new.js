import { createApp } from './src/app.js';
import { supabase } from './src/config/supabase.js';
import { UserRepository } from './src/repositories/UserRepository.js';
import { UserService } from './src/services/UserService.js';
import { UserController } from './src/controllers/UserController.js';

// 1. Dependency Injection Wiring
const userRepository = new UserRepository(supabase);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// 2. Initialize App
const app = createApp({ userController });

// 3. Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Production Server running on port ${PORT}`);
});
