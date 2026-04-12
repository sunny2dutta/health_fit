import { createApp } from './app.js';
import { supabase } from './config/supabase.js';
import { UserRepository } from './repositories/UserRepository.js';
import { TestimonialRepository } from './repositories/TestimonialRepository.js';
import { UserService } from './services/UserService.js';
import { TestimonialService } from './services/TestimonialService.js';
import { UserController } from './controllers/UserController.js';
import { TestimonialController } from './controllers/TestimonialController.js';
// 1. Dependency Injection Wiring
const userRepository = new UserRepository(supabase);
const testimonialRepository = new TestimonialRepository(supabase);
const userService = new UserService(userRepository);
const testimonialService = new TestimonialService(testimonialRepository);
const userController = new UserController(userService);
const testimonialController = new TestimonialController(testimonialService);
// 2. Initialize App
const app = createApp({
    userController,
    testimonialController
});
// 3. Start Server
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
app.listen(Number(PORT), HOST, () => {
    console.log(`🚀 Production Server running on ${HOST}:${PORT}`);
});
