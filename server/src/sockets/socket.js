let ioInstance;

export const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    socket.on('organization:join', (organizationId) => {
      if (organizationId) socket.join(`org:${organizationId}`);
    });
  });
};

export const emitToOrganization = (organizationId, event, payload) => {
  if (!ioInstance || !organizationId) return;
  ioInstance.to(`org:${organizationId}`).emit(event, payload);
};

export const emitGlobal = (event, payload) => {
  if (!ioInstance) return;
  ioInstance.emit(event, payload);
};
