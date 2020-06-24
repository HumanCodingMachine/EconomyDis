module.exports.permLevels = [
  {
    level: 0,
    name: 'User',
    check: () => true
  },
  
  {
    level: 4,
    name: 'Manager',
    check: (message) => message.member.permissions.has('MANAGE_SERVER')
  },

  {
    level: 5,
    name: 'Administrator',
    check: (message) => message.member.permissions.has('ADMINISTRATOR')
  },

  {
    level: 6,
    name: 'Server Owner',
    check: (message) => message.channel.type === 'text' ? (message.guild.owner.user.id === message.author.id ? true : false) : false
  },

  {
    level: 7,
    name: 'Bot Admin',
    check: (message) => this.admins.includes(message.author.id)
  },

  {
    level: 10,
    name: 'Bot Owner',
    check: (message) => this.owners.includes(message.author.id)
  }
];

module.exports.admins = ['274651286534619136'];
module.exports.owners = ['274651286534619136'];