import {TodoAppApplication} from '../application';
import {UserService} from './user.service';

export async function createDefaultAdmin(app: TodoAppApplication) {
  const userService = await app.get('services.UserService') as UserService;
  const admin = await userService.userRepo.findOne({where: {role: 'admin'}});
  if (!admin) {
    await userService.signup('admin', 'Admin123!', 'admin');
    console.log('✅ Default admin created: username=admin, password=Admin123!');
  } else {
    console.log('✅ Admin already exists');
  }
}