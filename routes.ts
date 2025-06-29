import { Routes } from '@nestjs/core'
import {AuthModule} from "./src/modules/auth/auth.module";



export const routes: Routes = [
    {
        path: 'auth',
        module: AuthModule,
    },
]
