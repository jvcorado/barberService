const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkBookings() {
  try {
    console.log("Verificando agendamentos no banco...");

    const bookings = await prisma.booking.findMany({
      include: {
        service: true,
        user: true,
      },
    });

    console.log(`Total de agendamentos encontrados: ${bookings.length}`);

    if (bookings.length === 0) {
      console.log("Nenhum agendamento encontrado. Criando dados de teste...");

      // Buscar usuário e barbearia existentes
      const user = await prisma.user.findFirst();
      const barbershop = await prisma.barberShop.findFirst();

      if (!user || !barbershop) {
        console.log("Usuário ou barbearia não encontrados. Criando...");

        if (!user) {
          const newUser = await prisma.user.create({
            data: {
              name: "Cliente Teste",
              email: "cliente@teste.com",
              admin: false,
            },
          });
          console.log("Usuário criado:", newUser.id);
        }

        if (!barbershop) {
          const newBarbershop = await prisma.barberShop.create({
            data: {
              name: "Barbearia Teste",
              address: "Rua Teste, 123",
              phones: ["11999999999"],
              description: "Barbearia de teste",
              imageUrl: "https://via.placeholder.com/300x200",
            },
          });
          console.log("Barbearia criada:", newBarbershop.id);
        }
      }

      // Buscar serviço existente ou criar
      let service = await prisma.barbershopService.findFirst();
      if (!service) {
        const barbershop = await prisma.barberShop.findFirst();
        service = await prisma.barbershopService.create({
          data: {
            name: "Corte de Cabelo",
            description: "Corte moderno e estiloso",
            price: 25.0,
            duration: 30,
            imageUrl: "https://via.placeholder.com/300x200",
            barberShopId: barbershop.id,
          },
        });
        console.log("Serviço criado:", service.id);
      }

      // Criar agendamentos de teste
      const finalUser = await prisma.user.findFirst();
      const finalBarbershop = await prisma.barberShop.findFirst();
      const finalService = await prisma.barbershopService.findFirst();

      const testBookings = [
        {
          serviceId: finalService.id,
          userId: finalUser.id,
          barberShopId: finalBarbershop.id,
          date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Amanhã
          status: "PENDING",
        },
        {
          serviceId: finalService.id,
          userId: finalUser.id,
          barberShopId: finalBarbershop.id,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Ontem
          status: "COMPLETED",
        },
        {
          serviceId: finalService.id,
          userId: finalUser.id,
          barberShopId: finalBarbershop.id,
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Depois de amanhã
          status: "CONFIRMED",
        },
      ];

      for (const bookingData of testBookings) {
        const booking = await prisma.booking.create({
          data: bookingData,
        });
        console.log("Agendamento criado:", booking.id);
      }
    } else {
      console.log("Agendamentos existentes:");
      bookings.forEach((booking) => {
        console.log(
          `- ID: ${booking.id}, Data: ${booking.date}, Status: ${booking.status}, Usuário: ${booking.user.name}, Serviço: ${booking.service.name}`,
        );
      });
    }
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBookings();
