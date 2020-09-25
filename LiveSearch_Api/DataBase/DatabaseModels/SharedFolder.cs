﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Live.Core;

    public class SharedFolder : Live.Core.Entity
    {
        public Guid UserId { get; protected set; }
        public Guid FolderId { get; protected set; }
        public Folder Folder { get; set; }
        public DateTime FallowedAt { get; protected set; }
        protected SharedFolder()
        {
        }
        public SharedFolder(Guid userId, Guid folderId)
        {
            this.FolderId = userId;
            this.UserId = folderId;
            FallowedAt = DateTime.Now;
        }
    }


