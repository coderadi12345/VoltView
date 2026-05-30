import { Plus, Building2, Layers3, Users } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '../components/DataTable';
import { SkeletonGrid } from '../components/Skeleton';
import { StatCard } from '../components/StatCard';
import { useResource } from '../hooks/useResource';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { api, unwrap } from '../services/api';

export const Organization = () => {
  const { user } = useAuth();
  const buildings = useResource('/buildings');
  const floors = useResource('/floors');
  const rooms = useResource('/rooms');
  const users = useResource('/users');

  const [modalType, setModalType] = useState(null); // 'building', 'floor', 'room'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [bName, setBName] = useState('');

  const [fName, setFName] = useState('');
  const [fNumber, setFNumber] = useState('');
  const [fBuilding, setFBuilding] = useState('');

  const [rName, setRName] = useState('');
  const [rBuilding, setRBuilding] = useState('');
  const [rFloor, setRFloor] = useState('');

  const closeModals = () => {
    setModalType(null);
    setBName('');
    setFName(''); setFNumber(''); setFBuilding('');
    setRName(''); setRBuilding(''); setRFloor('');
  };

  const handleBuildingSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await unwrap(api.post('/buildings', { name: bName, organization: user?.organization || user?.organization?._id }));
      const { items } = await unwrap(api.get('/buildings'));
      buildings.setRows(items);
      closeModals();
    } catch (err) { console.error('Failed to add building'); } finally { setIsSubmitting(false); }
  };

  const handleFloorSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await unwrap(api.post('/floors', { name: fName, number: Number(fNumber), building: fBuilding, organization: user?.organization || user?.organization?._id }));
      const { items } = await unwrap(api.get('/floors'));
      floors.setRows(items);
      closeModals();
    } catch (err) { console.error('Failed to add floor'); } finally { setIsSubmitting(false); }
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await unwrap(api.post('/rooms', { name: rName, building: rBuilding, floor: rFloor, organization: user?.organization || user?.organization?._id }));
      const { items } = await unwrap(api.get('/rooms'));
      rooms.setRows(items);
      closeModals();
    } catch (err) { console.error('Failed to add room'); } finally { setIsSubmitting(false); }
  };

  if (buildings.loading || floors.loading || rooms.loading || users.loading) return <SkeletonGrid />;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Buildings" value={buildings.rows.length} helper="Facilities in scope" icon={Building2} />
        <StatCard label="Floors" value={floors.rows.length} helper="Tracked floor plans" icon={Layers3} />
        <StatCard label="Users" value={users.rows.length} helper="RBAC members" icon={Users} />
      </section>

      <DataTable
        title="Buildings"
        action={<Button onClick={() => setModalType('building')}><Plus size={16} className="mr-2" /> Add Building</Button>}
        rows={buildings.rows}
        columns={[
          { key: 'name', label: 'Building' },
          { key: 'address', label: 'Address' },
          { key: 'manager', label: 'Manager', render: (row) => row.manager?.name || '-' },
          { key: 'areaSqFt', label: 'Area', render: (row) => `${row.areaSqFt || 0} sq ft` }
        ]}
      />

      <DataTable
        title="Floors"
        action={<Button onClick={() => setModalType('floor')}><Plus size={16} className="mr-2" /> Add Floor</Button>}
        rows={floors.rows}
        columns={[
          { key: 'name', label: 'Floor' },
          { key: 'number', label: 'Number' },
          { key: 'building', label: 'Building', render: (row) => row.building?.name || '-' }
        ]}
      />

      <DataTable
        title="Rooms"
        action={<Button onClick={() => setModalType('room')}><Plus size={16} className="mr-2" /> Add Room</Button>}
        rows={rooms.rows}
        columns={[
          { key: 'name', label: 'Room' },
          { key: 'type', label: 'Type' },
          { key: 'floor', label: 'Floor', render: (row) => row.floor?.name || '-' },
          { key: 'building', label: 'Building', render: (row) => row.building?.name || '-' }
        ]}
      />

      {/* Building Modal */}
      <Modal isOpen={modalType === 'building'} onClose={closeModals} title="Add New Building">
        <form onSubmit={handleBuildingSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Building Name</label>
            <Input value={bName} onChange={(e) => setBName(e.target.value)} required placeholder="e.g., Headquarters" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={closeModals}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>

      {/* Floor Modal */}
      <Modal isOpen={modalType === 'floor'} onClose={closeModals} title="Add New Floor">
        <form onSubmit={handleFloorSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Floor Name</label>
            <Input value={fName} onChange={(e) => setFName(e.target.value)} required placeholder="e.g., Ground Floor" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Floor Number</label>
            <Input type="number" value={fNumber} onChange={(e) => setFNumber(e.target.value)} required placeholder="e.g., 1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Building</label>
            <select value={fBuilding} onChange={(e) => setFBuilding(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-primary">
              <option value="">Select Building</option>
              {buildings.rows.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={closeModals}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>

      {/* Room Modal */}
      <Modal isOpen={modalType === 'room'} onClose={closeModals} title="Add New Room">
        <form onSubmit={handleRoomSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Room Name</label>
            <Input value={rName} onChange={(e) => setRName(e.target.value)} required placeholder="e.g., Conference Room A" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Building</label>
            <select value={rBuilding} onChange={(e) => setRBuilding(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-primary">
              <option value="">Select Building</option>
              {buildings.rows.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Floor</label>
            <select value={rFloor} onChange={(e) => setRFloor(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-primary">
              <option value="">Select Floor</option>
              {floors.rows.filter(f => !rBuilding || (f.building && f.building._id === rBuilding)).map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={closeModals}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
