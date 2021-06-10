using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Live.Core;

public class SharedDesktop : Live.Core.Entity
{
    public Guid UserId { get; protected set; }
    public Guid OwnerId { get; protected set; }
    public DateTime FallowedAt { get; protected set; }
    public string LocLeft { get; protected set; }
    public string LocTop { get; protected set; }

    protected SharedDesktop()
    {
    }
    public SharedDesktop(Guid userId, Guid ownerId, string left, string top)
    {
        this.OwnerId = ownerId;
        this.UserId = userId;
        FallowedAt = DateTime.Now;
        this.LocLeft = left;
        this.LocTop = top;
    }

    public void ChangeLocation(string left, string top)
    {
        this.LocLeft = left;
        this.LocTop = top;
    }
}
