const GetButtonExmaple = (buttonCustomId) => `import { ButtonInteraction } from 'discord.js';

export default {
  data: {
    customId: "${buttonCustomId}"
  },
  async execute(interaction: ButtonInteraction) {
    // Your code here
  }
};`;
export { GetButtonExmaple };
