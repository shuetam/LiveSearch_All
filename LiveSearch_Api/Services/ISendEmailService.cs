
using System;
using Live.Core;

namespace Live.Services
{
public interface ISendEmailService
{
     bool ResetPassword(User user, Guid resetId, string url);
}

}