import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { DataTable, StatusBadge } from '../components/DataTable';
import { SkeletonGrid } from '../components/Skeleton';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useResource } from '../hooks/useResource';
import { useAuth } from '../context/AuthContext';
import { api, unwrap } from '../services/api';

export const Devices = () => {
  const { user } = useAuth();
  const { rows, loading, setRows } = useResource('/devices');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('Custom Device');
  const [wattage, setWattage] = useState('');
  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Removed buildings and rooms fetch as we use manual text inputs

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const newDevice = await unwrap(api.post('/devices', {
        name,
        type,
        wattage: Number(wattage),
        building,
        room,
        organization: user?.organization?._id || user?.organization
      }));
      
      // Need to re-fetch or populate to get building/room names, but we can fake it locally or just reload
      const { items } = await unwrap(api.get('/devices'));
      setRows(items);

      setIsModalOpen(false);
      setName(''); setWattage(''); setBuilding(''); setRoom('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <SkeletonGrid />;

  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Device Management</h2>
          <p className="text-sm text-slate-400">Monitor, enable, disable, and govern every connected asset.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-slate-500" size={16} />
            <Input className="pl-9" placeholder="Search devices" />
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add Device
          </Button>
        </div>
      </Card>

      <DataTable
        title="Devices"
        rows={rows}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'type', label: 'Type' },
          { key: 'wattage', label: 'Wattage', render: (row) => `${row.wattage} W` },
          { key: 'room', label: 'Room' },
          { key: 'building', label: 'Building' },
          { key: 'runtimeHours', label: 'Runtime', render: (row) => `${row.runtimeHours || 0}h` },
          { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> }
        ]}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Device">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g., HVAC Unit A" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-primary"
            >
              <option value="AC">AC</option>
              <option value="Fan">Fan</option>
              <option value="Light">Light</option>
              <option value="TV">TV</option>
              <option value="Refrigerator">Refrigerator</option>
              <option value="Laptop">Laptop</option>
              <option value="Water Heater">Water Heater</option>
              <option value="Custom Device">Custom Device</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Wattage (W)</label>
            <Input type="number" value={wattage} onChange={(e) => setWattage(e.target.value)} required placeholder="e.g., 1500" min="1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Building</label>
            <Input value={building} onChange={(e) => setBuilding(e.target.value)} required placeholder="e.g., Main Building" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Room</label>
            <Input value={room} onChange={(e) => setRoom(e.target.value)} required placeholder="e.g., Office 101" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Device'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
