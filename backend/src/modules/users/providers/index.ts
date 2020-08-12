import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCrypHashProvider from './HashProvider/implementations/BCrypHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCrypHashProvider);
