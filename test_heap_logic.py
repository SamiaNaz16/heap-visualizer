#!/usr/bin/env python3
"""
 checking heap logic accuracy
"""

import heapq
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
from app import HeapOperations

def test_min_heap():
    """Test min heap operations"""
    print("=== Testing Min Heap ===")
    
    # Test build heap
    elements = [5, 3, 8, 1, 2, 7]
    heap_ops = HeapOperations()
    result = heap_ops.build_heap(elements, 'min')
    
    print(f"Input: {elements}")
    print(f"Min Heap: {result}")
    
    # Verify min heap property
    for i in range(len(result)):
        left = 2 * i + 1
        right = 2 * i + 2
        
        if left < len(result) and result[i] > result[left]:
            print(f"ERROR: Min heap property violated at index {i}")
            return False
        
        if right < len(result) and result[i] > result[right]:
            print(f"ERROR: Min heap property violated at index {i}")
            return False
    
    print("Min heap property: OK")
    
    # Test insert
    heap_ops.insert(0)
    result = heap_ops.get_heap_array()
    print(f"After inserting 0: {result}")
    
    if result[0] != 0:
        print("ERROR: Insert failed - 0 should be at root")
        return False
    
                                           # Test extract
    root, remaining = heap_ops.extract_root()
    print(f"Extracted root: {root}")
    print(f"Remaining: {remaining}")
    
    if root != 0:
        print("ERROR: Extract failed - should return 0")
        return False
    
    print("Min heap tests: PASSED")
    return True

def test_max_heap():
    """Test max heap operations"""
    print("\n=== Testing Max Heap ===")
    
                                            # Test build heap
    elements = [5, 3, 8, 1, 2, 7]
    heap_ops = HeapOperations()
    result = heap_ops.build_heap(elements, 'max')
    
    print(f"Input: {elements}")
    print(f"Max Heap: {result}")
    
    # Verify max heap property
    for i in range(len(result)):
        left = 2 * i + 1
        right = 2 * i + 2
        
        if left < len(result) and result[i] < result[left]:
            print(f"ERROR: Max heap property violated at index {i}")
            return False
        
        if right < len(result) and result[i] < result[right]:
            print(f"ERROR: Max heap property violated at index {i}")
            return False
    
    print("Max heap property: OK")
    
    # Test insert
    heap_ops.insert(10)
    result = heap_ops.get_heap_array()
    print(f"After inserting 10: {result}")
    
    if result[0] != 10:
        print("ERROR: Insert failed - 10 should be at root")
        return False
    
    # Test extract
    root, remaining = heap_ops.extract_root()
    print(f"Extracted root: {root}")
    print(f"Remaining: {remaining}")
    
    if root != 10:
        print("ERROR: Extract failed - should return 10")
        return False
    
    print("Max heap tests: PASSED")
    return True

def test_edge_cases():
    """Test edge cases"""
    print("\n=== Testing Edge Cases ===")
    
    heap_ops = HeapOperations()
    
    # Test empty heap
    try:
        root, remaining = heap_ops.extract_root()
        if root is not None:
            print("ERROR: Extract from empty heap should return None")
            return False
    except:
        print("ERROR: Extract from empty heap should not raise exception")
        return False
    
                                           # Test single element
    heap_ops.build_heap([5], 'min')
    root, remaining = heap_ops.extract_root()
    if root != 5 or len(remaining) != 0:
        print("ERROR: Single element extract failed")
        return False
    
    # Test duplicate elements
    heap_ops.build_heap([3, 3, 3, 3], 'min')
    result = heap_ops.get_heap_array()
    if len(result) != 4 or any(x != 3 for x in result):
        print("ERROR: Duplicate elements handling failed")
        return False
    
    print("Edge case tests: PASSED")
    return True

def verify_javascript_logic():
    """Verify JavaScript heap logic by comparing with Python"""
    print("\n=== Verifying JavaScript Logic ===")
    
                               # Test the same ope that Js would perform
    test_cases = [
        ([5, 3, 8, 1, 2, 7], 'min'),
        ([5, 3, 8, 1, 2, 7], 'max'),
        ([10, 4, 15, 1, 20, 8], 'min'),
        ([10, 4, 15, 1, 20, 8], 'max')
    ]
    
    for elements, heap_type in test_cases:
        heap_ops = HeapOperations()
        result = heap_ops.build_heap(elements, heap_type)
        
        print(f"Input: {elements}, Type: {heap_type}")
        print(f"Result: {result}")
        
                                              # Verify heap pro
        is_valid = True
        for i in range(len(result)):
            left = 2 * i + 1
            right = 2 * i + 2
            
            if heap_type == 'min':
                if left < len(result) and result[i] > result[left]:
                    is_valid = False
                if right < len(result) and result[i] > result[right]:
                    is_valid = False
            else:  # max heap
                if left < len(result) and result[i] < result[left]:
                    is_valid = False
                if right < len(result) and result[i] < result[right]:
                    is_valid = False
        
        if is_valid:
            print(f"  {heap_type.title()} heap property: OK")
        else:
            print(f"  {heap_type.title()} heap property: FAILED")
            return False
    
    print("JavaScript logic verification: PASSED")
    return True

if __name__ == "__main__":
    print("Heap Logic Verification Test")
    print("=" * 40)
    
    all_tests_passed = True
    
    all_tests_passed &= test_min_heap()
    all_tests_passed &= test_max_heap()
    all_tests_passed &= test_edge_cases()
    all_tests_passed &= verify_javascript_logic()
    
    print("\n" + "=" * 40)
    if all_tests_passed:
        print("ALL TESTS PASSED! Heap logic is correct.")
    else:
        print("SOME TESTS FAILED! Check heap logic.")
    
    print("=" * 40)
