'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CommissionFormType } from '@/types/CommissionFormType';
import { createCommission, updateCommission } from '@/app/api_/commissions';
import toast from 'react-hot-toast';
import SelectDropdown from '@/app/components/commons/Fields/SelectDropdown';
import { AxiosError } from 'axios';

interface Props {
    initialData?: CommissionFormType | null;
    onClose: () => void;
    onSuccess: () => void;
}

type TypeOption = {
    label: string;
    value: string;
};

const typeOptions: TypeOption[] = [
    { label: 'Product', value: 'product' },
    { label: 'Service', value: 'service' },
    { label: 'Withdrawal', value: 'withdrawal' },
];

export default function CommissionForm({ initialData, onClose, onSuccess }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<CommissionFormType>({
        defaultValues: {
            type: 'product',
            rate: 0,
        },
    });

    const [selectedType, setSelectedType] = useState<TypeOption>(typeOptions[0]);

    useEffect(() => {
        if (initialData) {
            const match = typeOptions.find(opt => opt.value === initialData.type);
            if (match) setSelectedType(match);
            reset(initialData);
        }
    }, [initialData, reset]);

    useEffect(() => {
        reset({
            ...getValues(),
            type: selectedType.value,
        });
    }, [selectedType, getValues, reset]);


    const onSubmit = async (data: CommissionFormType) => {
        const payload: CommissionFormType = {
            ...data,
            type: selectedType.value as CommissionFormType['type'],
        };

        try {
            if (initialData) {
                await updateCommission(initialData.id, payload);
                toast.success('Commission updated');
            } else {
                await createCommission(payload);
                toast.success('Commission created');
            }
            onClose();
            onSuccess();
        } catch (error) {
            const err = error as AxiosError;

            const data = err.response?.data as Record<string, string[]>;
            const message =
                (typeof data === 'object' &&
                    Object.values(data).flat().join(', ')) ||
                'Operation failed';
            toast.error(message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-gray-600">
            <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <SelectDropdown
                    options={typeOptions}
                    value={selectedType}
                    onChange={(val: TypeOption) => setSelectedType(val)}
                    className='w-full'
                />
                {errors.type && <p className="text-red-500 text-sm mt-1">Type is required</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Rate (%)</label>
                <input
                    type="number"
                    step="0.01"
                    {...register('rate', { required: true })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2"
                    placeholder="e.g. 10"
                />
                {errors.rate && <p className="text-red-500 text-sm mt-1">Rate is required</p>}
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm rounded-md bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60"
                >
                    {initialData ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
}
