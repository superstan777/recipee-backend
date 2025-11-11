import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs-extra';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(
    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,
  ) {}

  // download / save methods to implement
}
